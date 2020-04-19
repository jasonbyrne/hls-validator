import * as HLS from "hls-parser";
import * as bent from "bent";

const getManifest = bent("GET", "string");

HLS.setOptions({
  strictMode: true,
});

export class Stream {
  private _uri: string;
  private _masterPlaylist: HLS.types.MasterPlaylist | null;
  private _mediaPlaylists: HLS.types.MediaPlaylist[] = [];
  private _errors: string[] = [];

  public get masterPlaylist(): HLS.types.MasterPlaylist | null {
    return this._masterPlaylist;
  }

  public get mediaPlaylists(): HLS.types.MediaPlaylist[] {
    return this._mediaPlaylists;
  }

  public get errors(): string[] {
    return this._errors;
  }

  public static async load(uri: string): Promise<Stream> {
    const stream = new Stream(uri, await getManifest(uri));
    await stream._loadMediaPlaylists();
    return stream;
  }

  private constructor(uri: string, source: string) {
    this._uri = uri;
    try {
      const manifest:
        | HLS.types.MasterPlaylist
        | HLS.types.MediaPlaylist = HLS.parse(source);
      if (manifest.isMasterPlaylist) {
        this._masterPlaylist = <HLS.types.MasterPlaylist>manifest;
        this._masterPlaylist.uri = uri;
      } else {
        this._masterPlaylist = null;
        this._mediaPlaylists.push(<HLS.types.MediaPlaylist>manifest);
      }
    } catch (ex) {
      this._errors.push(ex.message);
      this._masterPlaylist = null;
    }
  }

  private async _loadMediaPlaylists() {
    if (this._masterPlaylist !== null) {
      const promises: Promise<void>[] = [];
      this._masterPlaylist.variants.forEach(async (variant) => {
        promises.push(
          new Promise(async (resolve) => {
            const url = new URL(variant.uri, this._uri);
            const content = await getManifest(url.href);
            this._mediaPlaylists.push(
              <HLS.types.MediaPlaylist>HLS.parse(content)
            );
            resolve();
          })
        );
      });
      await Promise.all(promises);
    }
  }

  public validate(): boolean {
    if (this._masterPlaylist !== null || this._mediaPlaylists.length > 0) {
      return true;
    }
    return false;
  }
}

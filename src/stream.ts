import * as HLS from "hls-parser";
import * as bent from "bent";

const getManifest = bent("GET", "string");

HLS.setOptions({
  strictMode: true,
});

export class Stream {
  private _manifest: HLS.types.MasterPlaylist | HLS.types.MediaPlaylist | null;
  private _errors: string[] = [];

  public get errors(): string[] {
    return this._errors;
  }

  public static async load(uri: string): Promise<Stream> {
    return new Stream(await getManifest(uri));
  }

  private constructor(source: string) {
    try {
      this._manifest = HLS.parse(source);
    } catch (ex) {
      this._errors.push(ex.message);
      this._manifest = null;
    }
  }

  public validate(): boolean {
    if (this._manifest !== null) {
      return true;
    }
    return false;
  }
}

const hls = require("../dist/index");
const msv = require("../dist/mediastreamvalidator");

const bitMovinSample =
  "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8";
const jwPlayerSample = "https://content.jwplatform.com/manifests/yp34SRmf.m3u8";
const floWrestling =
  "https://damb2tknfsomm.cloudfront.net/uploaded/KRVpJG0KgRPe2dAzL0MPge4gz520vqyM/playlist.m3u8";

(async () => {
  const stream = await hls.Stream.load(floWrestling);
  if (stream.validate()) {
    console.log("This is a valid stream.");
  } else {
    console.log(`Invalid stream. Following issues noted: ${stream.errors}`);
  }
  console.log(stream);
})();

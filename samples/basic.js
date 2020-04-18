const hls = require("../dist/index");

(async () => {
  const stream = await hls.Stream.load(
    "https://bitmovin-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
  );
  if (stream.validate()) {
    console.log("This is a valid stream.");
  } else {
    console.log(`Invalid stream. Following issues noted: ${stream.errors}`);
  }
})();

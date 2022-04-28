const express = require("express");
const ytdl = require("ytdl-core");
const fs = require("fs");
const YouTubeWatch = require("youtube-watch");
const ffmpeg = require("ffmpeg");
const tesseract = require("node-tesseract-ocr");
const path = require("path");
const sharp = require("sharp");
const generateUniqueId = require("generate-unique-id");
const readline = require("readline");

/* const yw = new YouTubeWatch({
  secretKey: 'something_unique',
  hubCallback: 'http://your-ip-or-domain/',
  hubPort: 9001,
});

yw.on('start', () => {
  let channels = ['UCY_UYz9m6XYmCpqC5EuqKMg',
                  'UCGY2w6hIZWwyxasBUN7wbaQ'];

  yw.watch(channels);
});

yw.on('notified', video => {
  console.log(`${video.author} just uploaded a new video titled: ${video.title}`);
});

yw.start();
 */

const url = "https://www.youtube.com/watch?v=668nUCeBHyY";
const filestream = fs.createWriteStream("./video/video.mp4");
const vpath = "./video/video.mp4";
const config = { lang: "eng", oem: 1, psm: 3 };

if (!fs.existsSync(vpath)) {
  ytdl(`${url}`)
    .pipe(filestream)
    .on("finish", function () {
      filestream.close();

      try {
        var process = new ffmpeg("./video/video.mp4");
        process.then(
          function (video) {
            // Callback mode
            video.fnExtractFrameToJPG("./frames/", {
              every_n_frames: 100,
              file_name: "my_frame_%t_%s",
            });
          },
          function (err) {
            console.log("Error: " + err);
          }
        );
      } catch (e) {
        console.log(e.code);
        console.log(e.msg);
      }
    });

  // const directoryPath = path.join(__dirname, "frames");

   /*fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("directory issue " + err);
    }
    files.forEach(function (file) {
      let originalImage = `./frames/${file}`;
      let outputImage = `./croped/${file}`;

      sharp(originalImage)
        .extract({ width: 10, height: 10, left: 10, top: 10 })
        .toFile(outputImage)
        .then(function (new_file_info) {
          console.log("Image cropped and saved");
        })
        .catch(function (err) {
          console.log(err);
        });
    });
  });*/
} else {



  const directoryPath = path.join(__dirname, "frames");

  fs.readdir(directoryPath, function (err, files) {
    if (err) {
      return console.log("directory issue " + err);
    }
    files.forEach(function (file) {
      tesseract
        .recognize(`./frames/${file}`, config)
        .then((text) => {
          var re = new RegExp('(\w*\S.[A-Z]-)+');

            console.log(re.test(text));
        })
        .catch((error) => {
          console.log(error.message);
        });
    });
  });
}

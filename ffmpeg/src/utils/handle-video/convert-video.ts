import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);

export async function convertAllResolutions(
  inputPath: string,
  outputPath: string,
  key: string
) {
  await convertToResolution(inputPath, `${outputPath}/1080p${key}`, 1080);
  await convertToResolution(inputPath, `${outputPath}/720p${key}`, 720);
  await convertToResolution(inputPath, `${outputPath}/480p${key}`, 480);
  await convertToResolution(inputPath, `${outputPath}/240p${key}`, 240);
  await convertToResolution(inputPath, `${outputPath}/144p${key}`, 144);
}

function convertToResolution(
  inputPath: string,
  outputPath: string,
  height: number
) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .outputOptions([
        "-preset medium",
        "-crf 23",
        "-movflags +faststart",
        "-pix_fmt yuv420p",
      ])
      .size(`?x${height}`) // width auto calculated to keep aspect ratio
      .on("end", () => {
        console.log(`Conversion to ${height}p finished`);
        resolve("");
      })
      .on("error", (err) => {
        console.error(`Error at ${height}p conversion:`, err);
        reject(err);
      })
      .save(outputPath);
  });
}

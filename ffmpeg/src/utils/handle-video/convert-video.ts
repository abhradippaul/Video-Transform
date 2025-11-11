import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);

export function convertToResolution(
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
      .size(`?x${height}`)
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

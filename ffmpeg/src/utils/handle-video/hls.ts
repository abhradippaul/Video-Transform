import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);

export function convertHLSVideo(inputPath: string, outputPath: string) {
  const outputPlaylist = path.join(outputPath, "index.m3u8");
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-hls_time 4",
        "-hls_playlist_type vod",
        `-hls_segment_filename ${path.join(outputPath, "segment%03d.ts")}`,
        "-start_number 0",
      ])
      .output(outputPlaylist)
      .on("start", (cmd) => {
        console.log("FFmpeg command:", cmd);
      })
      .on("progress", (progress) => {
        console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
      })
      .on("end", () => {
        console.log("HLS conversion complete!");
        resolve("");
      })
      .on("error", (err) => {
        console.error("Error during processing:", err.message);
        reject(err);
      })
      .run();
  });
}

import ffmpegStatic from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";

const videoPath = "videos/input/thumbnail";
const outputPath = "videos/output/thumbnail";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);

export async function createThumnail(fileName: string) {
  console.log(fileName);
  ffmpeg(`${videoPath}/${fileName}`)
    .outputOptions([
      "-ss 00:00:01", // Seek to 1 second into the video for the thumbnail
      "-vframes 1", // Capture one frame
      "-q:v 5", // Set output quality (lower is better)
      "-vf scale=300:-1", // Scale while maintaining aspect ratio
    ])
    .save(`${outputPath}/${fileName}`)
    .on("end", () => {
      console.log("Thumbnail generated successfully!");
    })
    .on("error", (err) => {
      console.error(`Error generating thumbnail: ${err.message}`);
    });
}

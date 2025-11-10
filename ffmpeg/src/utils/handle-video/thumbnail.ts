import ffmpegStatic from "ffmpeg-static";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);
ffmpeg.setFfprobePath(ffprobe.path);

export async function createThumnail(inputPath: string, outputPath: string) {
  try {
    const duration = await getVideoDuration(inputPath);
    const randomTime = getRandomTimestamp(duration);
    console.log(`🎯 Generating thumbnail at ${randomTime.toFixed(2)}s`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions([
          `-ss ${randomTime}`,
          "-vframes 1",
          "-q:v 5",
          "-vf scale=300:-1",
        ])
        .save(outputPath)
        .on("end", () => {
          console.log("Thumbnail generated successfully!");
          resolve("");
        })
        .on("error", (err) => {
          console.error(`Error generating thumbnail: ${err.message}`);
          reject(err);
        });
    });
  } catch (err) {
    console.error("Error reading video duration:", err);
    throw err;
  }
}

function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format?.duration || 0;
      resolve(duration);
    });
  });
}

function getRandomTimestamp(duration: number): number {
  if (duration <= 2) return 1;
  const startBuffer = 1;
  const endBuffer = 1;
  return Math.random() * (duration - startBuffer - endBuffer) + startBuffer;
}

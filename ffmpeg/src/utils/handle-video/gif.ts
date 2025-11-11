import ffmpegStatic from "ffmpeg-static";
import ffprobe from "@ffprobe-installer/ffprobe";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(
  typeof ffmpegStatic === "string" ? ffmpegStatic : ffmpegStatic.default || ""
);
ffmpeg.setFfprobePath(ffprobe.path);

export async function createGif(inputPath: string, outputPath: string) {
  try {
    const duration = await getVideoDuration(inputPath);
    const randomTime = getRandomTimestamp(duration);
    console.log(`🎯 Generating Gif at ${randomTime.toFixed(2)}s`);

    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(randomTime)
        .duration(5)
        .outputOptions([
          "-vf",
          "fps=10,scale=320:-1:flags=lanczos",
          "-loop",
          "0",
        ])
        .save(outputPath)
        .on("end", () => {
          console.log("Gif generated successfully!");
          resolve("");
        })
        .on("error", (err) => {
          console.error(`Error generating gif: ${err.message}`);
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
  if (duration <= 6) return 5;
  const startBuffer = 1;
  const endBuffer = 1;
  return Math.random() * (duration - startBuffer - endBuffer) + startBuffer;
}

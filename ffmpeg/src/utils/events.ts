import { downloadS3File, uploadS3File } from "./aws/s3.js";
import { deleteLocalData } from "./handle-fs.js";
import { convertToResolution } from "./handle-video/convert-video.js";
import { createGif } from "./handle-video/gif.js";
import { createThumnail } from "./handle-video/thumbnail.js";

export async function handleThumbnailEvent(s3Key: string) {
  const fileName = s3Key.split("/")[1];
  const inputPath = `data/thumbnail/raw/${fileName}`;
  const outputFileName = `${fileName?.split(".")[0]}.jpeg`;
  const outputPath = `data/thumbnail/transformed/${outputFileName}`;
  const uploadKey = s3Key.replace("mp4", "jpeg");

  await downloadS3File(s3Key, inputPath);
  await createThumnail(inputPath, outputPath);
  await uploadS3File(uploadKey, outputPath, "image/jpeg");
  await deleteLocalData(inputPath);
  await deleteLocalData(outputPath);

  console.log("✅ Thumbnail processed and uploaded:", uploadKey);
}

export async function handleGifEvent(s3Key: string) {
  const fileName = s3Key.split("/")[1];
  const inputPath = `data/gif/raw/${fileName}`;
  const outputFileName = `${fileName?.split(".")[0]}.gif`;
  const outputPath = `data/gif/transformed/${outputFileName}`;
  const uploadKey = s3Key.replace("mp4", "gif");

  await downloadS3File(s3Key, inputPath);
  await createGif(inputPath, outputPath);
  await uploadS3File(uploadKey, outputPath, "image/gif");
  await deleteLocalData(inputPath);
  await deleteLocalData(outputPath);

  console.log("✅ Gif processed and uploaded:", uploadKey);
}

export async function handleHLSEvent(s3Key: string) {
  const resolutions = [1080, 720, 480, 360, 240, 144];
  const fileName = s3Key.split("/")[1] || "";
  const inputPath = `data/hls/raw/${fileName}`;
  const outputPath = `data/hls/transformed`;

  await downloadS3File(s3Key, inputPath);

  await Promise.all(
    resolutions.map((res) =>
      convertToResolution(
        inputPath,
        `${outputPath}/${fileName}-${res}p.mp4`,
        res
      )
    )
  );

  await Promise.all(
    resolutions.map((res) => {
      const outputFile = `${outputPath}/${fileName}-${res}p.mp4`;
      const uploadKey = `hls/${fileName}-${res}p.mp4`;
      return uploadS3File(uploadKey, outputFile, "video/mp4");
    })
  );

  await Promise.all(
    resolutions.map((res) =>
      deleteLocalData(`${outputPath}/${fileName}-${res}p.mp4`)
    )
  );

  await deleteLocalData(inputPath);

  console.log("✅ HLS processed and uploaded:");
}

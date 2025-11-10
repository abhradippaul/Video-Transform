import { downloadS3File, uploadS3File } from "./aws/s3.js";
import { deleteLocalData } from "./handle-fs.js";
import { createThumnail } from "./handle-video/thumbnail.js";

export async function handleThumbnailEvent(s3Key: string) {
  const fileName = s3Key.split("/")[1];
  const inputPath = `data/thumbnail/raw/${fileName}`;
  const outputFileName = `${fileName?.split(".")[0]}.jpeg`;
  const outputPath = `data/thumbnail/transformed/${outputFileName}`;
  const uploadKey = s3Key.replace("mp4", "jpeg");

  await downloadS3File(s3Key, inputPath);
  await createThumnail(inputPath, outputPath);
  await uploadS3File(uploadKey, outputPath);
  await deleteLocalData(inputPath);
  await deleteLocalData(outputPath);

  console.log("✅ Thumbnail processed and uploaded:", uploadKey);
}

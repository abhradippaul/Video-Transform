import dotenv from "dotenv";
import { s3Client } from "./aws.js";
import fs from "fs";
import path from "path";
dotenv.config();

export async function downloadS3File(keyName: string, localFilePath: string) {
  const params = {
    Bucket: process.env.AWS_RAW_BUCKET_NAME!,
    Key: keyName,
  };

  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(localFilePath);

    s3Client
      .getObject(params)
      .createReadStream()
      .pipe(fileStream)
      .on("error", (err) => {
        console.error("Error downloading image:", err);
        reject(err);
      })
      .on("finish", () => {
        console.log(`Image downloaded successfully to ${localFilePath}`);
        resolve("");
      });
  });
}

export async function uploadS3File(
  keyName: string,
  localFilePath: string,
  contentType: string
) {
  if (!fs.existsSync(localFilePath)) {
    throw new Error(`File not found: ${localFilePath}`);
  }

  const params = {
    Bucket: process.env.AWS_TRANSFORMED_BUCKET_NAME!,
    Key: keyName,
    Body: fs.createReadStream(localFilePath),
    ContentType: contentType,
  };

  await s3Client.upload(params).promise();
}

export async function uploadHLSFolderToS3(baseKey: string, folderPath: string) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileKey = `${baseKey}/${file}`;

    const fileContent = fs.readFileSync(filePath);

    await s3Client
      .putObject({
        Bucket: process.env.AWS_TRANSFORMED_BUCKET_NAME!,
        Key: fileKey,
        Body: fileContent,
        ContentType: file.endsWith(".m3u8")
          ? "application/x-mpegURL"
          : "video/MP2T",
      })
      .promise();

    console.log(`✅ Uploaded ${fileKey}`);
  }
}

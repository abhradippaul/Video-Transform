import dotenv from "dotenv";
import { s3Client } from "./aws.js";
import fs from "fs";
dotenv.config();

export function downloadS3File(keyName: string, localFilePath: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: keyName,
  };
  const fileStream = fs.createWriteStream(localFilePath);
  s3Client
    .getObject(params)
    .createReadStream()
    .pipe(fileStream)
    .on("error", (err) => {
      console.error("Error downloading image:", err);
    })
    .on("close", () => {
      console.log(`Image downloaded successfully to ${localFilePath}`);
    });
}

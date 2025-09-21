import dotenv from "dotenv";
import { s3Client } from "./aws.js";
import fs from "fs";
dotenv.config();

export async function downloadS3File(keyName: string, localFilePath: string) {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: keyName,
  };
  const data = await s3Client.getObject(params).promise();
  const body = data.Body as Buffer | NodeJS.ReadableStream;
  if (Buffer.isBuffer(body)) {
    await fs.promises.writeFile(localFilePath, body);
  } else {
    await new Promise<void>((resolve, reject) => {
      (body as NodeJS.ReadableStream)
        .pipe(fs.createWriteStream(localFilePath))
        .on("finish", resolve)
        .on("error", reject);
    });
  }
}

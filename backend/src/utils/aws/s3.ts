import dotenv from "dotenv";
dotenv.config();
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./aws.js";

export async function putS3SignedUrl(key: string) {
  const getObjectParams = {
    Bucket: process.env.AWS_RAW_BUCKET_NAME,
    Key: key,
  };
  const command = new PutObjectCommand(getObjectParams);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getS3SignedUrl(key: string) {
  const getObjectParams = {
    Bucket: process.env.AWS_TRANSFORMED_BUCKET_NAME,
    Key: key,
  };
  const command = new GetObjectCommand(getObjectParams);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

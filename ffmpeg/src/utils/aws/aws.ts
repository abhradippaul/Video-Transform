import dotenv from "dotenv";
dotenv.config();

import AWS from "aws-sdk";

AWS.config.update({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESSKEYID!,
    secretAccessKey: process.env.AWS_SECRETACCESSKEY!,
  },
});

const s3Client = new AWS.S3({ apiVersion: "2006-03-01" });

export { AWS, s3Client };

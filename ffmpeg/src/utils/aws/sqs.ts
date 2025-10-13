import dotenv from "dotenv";
dotenv.config();
import { AWS } from "./aws.js";
import { downloadS3File } from "./s3.js";
import fs from "fs";
import { convertAllResolutions } from "../handle-video/convert-video.js";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;
const outputPath = "./videos/output";

const paramsReceiveMessage = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 20,
  // MessageAttributeNames: ["welcome_mail"],
};

export async function pollMessages() {
  while (true) {
    await reciveMessage();
  }
}

async function reciveMessage() {
  try {
    const { $response, Messages } = await s3UploadNotificationSQS
      .receiveMessage(paramsReceiveMessage)
      .promise();
    if ($response.error) {
      console.error("Error receiving messages:", $response.error);
    } else if (Messages?.length) {
      Messages?.forEach((message) => {
        const body = JSON.parse(message?.Body || "");
        const s3Event = body.Records[0].s3;
        const s3EventMsgKey = s3Event.object.key;
        const localS3Key = s3EventMsgKey.split("/")[1];
        console.log("Message Attributes:", s3EventMsgKey);
        downloadS3File(s3EventMsgKey, `videos/input/${localS3Key}`).then(
          async () => {
            console.log(s3EventMsgKey);
            const inputPath = `./videos/input/${localS3Key}`;
            convertAllResolutions(inputPath, outputPath, localS3Key)
              .then(() => {
                deleteMessage(message?.ReceiptHandle || "").then(() => {
                  fs.unlink(`videos/input/${localS3Key}`, (err) => {
                    if (err) throw err;
                    console.log("path/file.txt was deleted");
                  });
                });
                console.log("Video conversion completed");
              })
              .catch((err) => {
                console.log("Error occured during video conversion ", err);
              });
          }
        );
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteMessage(receiptHandle: string) {
  try {
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: receiptHandle,
    };

    s3UploadNotificationSQS.deleteMessage(deleteParams, (err, data) => {
      if (err) {
        console.error("Delete Error", err);
      } else {
        console.log("Message Deleted", data);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

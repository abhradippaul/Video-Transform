import dotenv from "dotenv";
dotenv.config();
import { AWS } from "./aws.js";
import { downloadS3File } from "./s3.js";
import fs from "fs";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;

const paramsReceiveMessage = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 20,
  MessageAttributeNames: ["welcome_mail"],
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
        console.log("Message Attributes:", s3EventMsgKey);
        downloadS3File(s3EventMsgKey, `videos/input/${s3EventMsgKey}`)
          .then
          // async () => {
          //   deleteMessage(message?.ReceiptHandle || "").then(() => {
          //     fs.unlink(`videos/input/${s3EventMsgKey}`, (err) => {
          //       if (err) throw err;
          //       console.log("path/file.txt was deleted");
          //     });
          //   });
          // }
          ();
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

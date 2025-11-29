import dotenv from "dotenv";
dotenv.config();
import { AWS } from "./aws.js";
import {
  handleGifEvent,
  handleHLSEvent,
  handleImageResizeEvent,
  handleThumbnailEvent,
  handleVideoResolutionEvent,
} from "../events.js";

const s3UploadNotificationSQS = new AWS.SQS();
const queueUrl = process.env.AWS_S3_UPLOAD_SQS!;

const paramsReceiveMessage = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 10,
  VisibilityTimeout: 30,
  WaitTimeSeconds: 20,
};

export async function pollMessages() {
  while (true) {
    await reciveMessage();
  }
}

async function reciveMessage() {
  try {
    const { Messages } = await s3UploadNotificationSQS
      .receiveMessage(paramsReceiveMessage)
      .promise();

    if (!Messages || !Messages.length) {
      console.log("No messages received.");
      return;
    }

    for (const message of Messages) {
      if (!message.Body) continue;

      console.log(message);

      const body = JSON.parse(message.Body);

      const s3Key = body?.Records?.[0]?.s3?.object?.key;
      if (s3Key) {
        console.log("📩 Processing S3 Key:", s3Key);

        if (s3Key.includes("thumbnail")) {
          await handleThumbnailEvent(s3Key);
        } else if (s3Key.includes("gif")) {
          await handleGifEvent(s3Key);
        } else if (s3Key.includes("hls")) {
          await handleHLSEvent(s3Key);
        } else if (s3Key.includes("video-res")) {
          await handleVideoResolutionEvent(s3Key);
        }
      } else if (body.uri) {
        if (body.uri.includes("image-resize")) {
          await handleImageResizeEvent(body.uri);
        }
      }

      deleteMessage(message.ReceiptHandle!);
    }
  } catch (err) {
    console.log("Error processing SQS messages: ", err);
  }
}

function deleteMessage(receiptHandle: string) {
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

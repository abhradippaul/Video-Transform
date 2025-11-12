const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({
  region: "ap-south-1",
});

exports.handler = async (event) => {
  try {
    console.log(JSON.stringify(event));
    const queueUrl = "";
    if (!queueUrl) {
      throw new Error("Missing environment variable: SQS_QUEUE_URL");
    }

    const uri = event.Records[0].cf.request.uri;
    const status = event.Records[0].cf.response.status;
    const querystring = event.Records[0].cf.request.querystring;

    if (uri === "/favicon.ico") {
      return event.Records[0].cf.response;
    }

    if (status === 403 || status === 404) {
      const messageBody = JSON.stringify({
        querystring,
        status,
        uri,
      });

      const command = new SendMessageCommand({
        QueueUrl: queueUrl,
        MessageBody: messageBody,
        MessageAttributes: {
          Source: {
            DataType: "String",
            StringValue: "LambdaFunction",
          },
        },
      });

      await sqsClient.send(command);
    }

    return event.Records[0].cf.response;
  } catch (error) {
    console.error("Error sending SQS message:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

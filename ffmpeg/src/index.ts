import dotenv from "dotenv";
dotenv.config();

import { convertAllResolutions } from "./utils/handle-video/convert-video.js";
import { pollMessages } from "./utils/aws/sqs.js";

const inputPath = "videos/input/";
const outputPath = "videos/output";

// convertAllResolutions(inputPath, outputPath)
//   .then(() => {
//     console.log("Video conversion completed");
//   })
//   .catch((err) => {
//     console.log("Error occured during video conversion ", err);
//   });
pollMessages();

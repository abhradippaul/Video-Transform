import dotenv from "dotenv";
dotenv.config();

import { convertAllResolutions } from "./utils/handle-video/convert-video.js";
import { pollMessages } from "./utils/aws/sqs.js";

pollMessages();

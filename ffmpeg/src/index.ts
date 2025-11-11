import dotenv from "dotenv";
dotenv.config();

import { pollMessages } from "./utils/aws/sqs.js";

pollMessages();

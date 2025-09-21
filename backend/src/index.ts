import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { urlencoded } from "express";
import { getS3SignedUrl } from "./utils/aws/s3.js";
import { v4 as uuidv4 } from "uuid";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.get("/get-presigned-url", async (req, res) => {
  const fileName = uuidv4();
  const url = await getS3SignedUrl(fileName);
  res.status(200).json({
    msg: "Recived S3 url",
    url,
    fileName,
  });
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});

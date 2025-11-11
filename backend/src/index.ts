import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { urlencoded } from "express";
import { getS3SignedUrl, putS3SignedUrl } from "./utils/aws/s3.js";

const app = express();
const PORT = process.env.PORT || 8000;
const CLOUDFRONT = process.env.CLOUDFRONT || "";
const CLOUDFRONT_URL = process.env.CLOUDFRONT_URL || "";

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.post("/raw/put-presigned-url", async (req, res) => {
  const body = req.body;

  if (!body?.mime || !body?.type) {
    return res.status(400).json({
      msg: "Missing mime or type",
    });
  }

  const { mime, type } = req.body;

  const timestamp = Date.now();
  const fileName = `${type}/${timestamp}.${mime}`;
  const url = await putS3SignedUrl(fileName);

  res.status(200).json({
    msg: "Recived S3 url",
    url,
    fileName: timestamp,
  });
});

app.get("/transformed/get-presigned-url", async (req, res) => {
  const query = req.query;

  if (!query.type || !query.fileName) {
    return res.status(400).json({
      msg: "Query not found",
    });
  }

  let s3Url = "";

  if (CLOUDFRONT === "true") {
    s3Url = `https://${CLOUDFRONT_URL}/${query.type}/${query.fileName}`;
  } else if (CLOUDFRONT === "false") {
    s3Url = await getS3SignedUrl(`${query.type}/${query.fileName}`);
  }

  if (!s3Url) {
    return res.status(400).json({
      msg: "File not found",
    });
  }

  res.status(200).json({
    url: s3Url,
    msg: "File found",
  });
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});

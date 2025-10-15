import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
import express, { urlencoded } from "express";
import { putS3SignedUrl } from "./utils/aws/s3.js";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.json({ msg: "hello" });
});

app.post("/video/put-presigned-url", async (req, res) => {
  const body = req.body;

  if (!body?.mime || !body?.type) {
    return res.status(400).json({
      msg: "Missing mime or type",
    });
  }

  const { mime, type } = req.body;

  const timestamp = Date.now();
  const fileName = `raw-format/${type}/${timestamp}.${mime}`;
  const url = await putS3SignedUrl(fileName);

  res.status(200).json({
    msg: "Recived S3 url",
    url,
    fileName,
  });
});

app.post("/image/put-presigned-url", async (req, res) => {
  const body = req.body;

  if (!body?.mime) {
    return res.status(400).json({
      msg: "Missing mime type",
    });
  }

  const { mime } = req.body;

  const timestamp = Date.now();
  const fileName = `image/${timestamp}.${mime}`;
  const url = await putS3SignedUrl(fileName);

  res.status(200).json({
    msg: "Recived S3 url",
    url,
    fileName,
  });
});

app.listen(PORT, () => {
  console.log("Server connected successfully on port no", PORT);
});

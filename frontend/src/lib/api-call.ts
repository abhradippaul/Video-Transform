import axios from "axios";
import type { Dispatch, SetStateAction } from "react";

interface GetS3UploadData {
  url: string;
  fileName: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getS3UploadData(
  mime: string,
  type: string
): Promise<GetS3UploadData | null | undefined> {
  try {
    const response = await axios.post(`${BACKEND_URL}/raw/put-presigned-url`, {
      mime,
      type,
    });
    const data = response.data as GetS3UploadData | null | undefined;
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function uploadRawData(s3PutUrl: string, file: File) {
  try {
    const response = await axios.put(s3PutUrl, file, {
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    });
    if (response.status === 200) {
      console.log("Raw data uploaded");
    } else {
      console.log("Error uploading raw data ", response.data);
    }
  } catch (err) {
    console.log(err);
  }
}

export async function getTransformedData(
  type: string,
  fileName: string,
  isFetched: boolean,
  setTransformedUrl: Dispatch<SetStateAction<string>>
) {
  let count = 0;
  const intervalId = setInterval(async () => {
    count++;
    if (count >= 3 || !isFetched) {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/transformed/get-presigned-url`,
          {
            params: {
              type,
              fileName,
            },
          }
        );
        const data = response.data;
        console.log(data);
        setTransformedUrl(data.url || "");
      } catch (err) {
        console.log(err);
      }
      clearInterval(intervalId);
    }
  }, 10000);
}

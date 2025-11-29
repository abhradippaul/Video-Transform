import { useRef, type Dispatch, type SetStateAction } from "react";
import ImageUploader from "./video-upload";
import videojs from "video.js";
import {
  getS3UploadData,
  getTransformedData,
  uploadRawData,
} from "@/lib/api-call";
import type { SetURLSearchParams } from "react-router-dom";
import VideoPlayer from "./videojs";

interface HLSComponentProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setSearchParams: SetURLSearchParams;
  transformedUrl: string | null | undefined;
  setTransformedUrl: Dispatch<SetStateAction<string>>;
  searchParams: URLSearchParams;
}

function HLSComponent({
  setIsLoading,
  setSearchParams,
  transformedUrl,
  setTransformedUrl,
  searchParams,
}: HLSComponentProps) {
  const onCreateVideoHLS = async (file: File | null) => {
    const type = "hls";
    console.log("Uploading");
    try {
      setIsLoading(true);
      if (file && type) {
        const mime = file.type.split("/")[1];
        if (mime) {
          const s3UploadData = await getS3UploadData(mime, type);
          if (s3UploadData) {
            setSearchParams((prev) => {
              prev.set("fileName", `${s3UploadData.fileName}.mp4`);
              return prev;
            });
            await uploadRawData(s3UploadData.url, file);
            setTimeout(async () => {
              await getTransformedData(
                type,
                mime,
                `${s3UploadData.fileName}`,
                Boolean(transformedUrl),
                setTransformedUrl
              );
            }, 10000);
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return searchParams.get("fileName") ? (
    transformedUrl ? (
      <VideoPlayer src={`${transformedUrl}/index.m3u8`} />
    ) : (
      <div />
    )
  ) : (
    <ImageUploader onUpload={onCreateVideoHLS} fileType="video" />
  );
}

export default HLSComponent;

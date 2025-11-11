import type { Dispatch, SetStateAction } from "react";
import ImageUploader from "./video-upload";
import {
  getS3UploadData,
  getTransformedData,
  uploadRawData,
} from "@/lib/api-call";
import type { SetURLSearchParams } from "react-router-dom";

interface HLSComponentProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
  transformedUrl: string | null | undefined;
  setTransformedUrl: Dispatch<SetStateAction<string>>;
}

function HLSComponent({
  setIsLoading,
  setSearchParams,
  transformedUrl,
  setTransformedUrl,
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
            await getTransformedData(
              type,
              `${s3UploadData.fileName}.mp4`,
              Boolean(transformedUrl),
              setTransformedUrl
            );
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return transformedUrl ? (
    <video src={transformedUrl} />
  ) : (
    <ImageUploader onUpload={onCreateVideoHLS} fileType="video" />
  );
}

export default HLSComponent;

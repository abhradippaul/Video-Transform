import type { Dispatch, SetStateAction } from "react";
import ImageUploader from "./video-upload";
import {
  getS3UploadData,
  getTransformedData,
  uploadRawData,
} from "@/lib/api-call";
import type { SetURLSearchParams } from "react-router-dom";

interface ThumbnailProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
  transformedUrl: string | null | undefined;
  setTransformedUrl: Dispatch<SetStateAction<string>>;
}

function Thumbnail({
  setIsLoading,
  setSearchParams,
  transformedUrl,
  setTransformedUrl,
}: ThumbnailProps) {
  const onCreateVideoThumbnail = async (file: File | null) => {
    const type = "thumbnail";
    console.log("Uploading");
    try {
      setIsLoading(true);
      if (file && type) {
        const mime = file.type.split("/")[1];
        if (mime) {
          const s3UploadData = await getS3UploadData(mime, type);
          if (s3UploadData) {
            setSearchParams((prev) => {
              prev.set("fileName", `${s3UploadData.fileName}.jpeg`);
              return prev;
            });
            await uploadRawData(s3UploadData.url, file);
            await getTransformedData(
              type,
              `${s3UploadData.fileName}.jpeg`,
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
    <img src={transformedUrl} alt="image" />
  ) : (
    <ImageUploader onUpload={onCreateVideoThumbnail} fileType="video" />
  );
}

export default Thumbnail;

import type { Dispatch, SetStateAction } from "react";
import ImageUploader from "./video-upload";
import {
  getS3UploadData,
  getTransformedData,
  uploadRawData,
} from "@/lib/api-call";
import type { SetURLSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface VideoResolutionComponentProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  setSearchParams: SetURLSearchParams;
  transformedUrl: string | null | undefined;
  setTransformedUrl: Dispatch<SetStateAction<string>>;
  searchParams: URLSearchParams;
}

const resolutions = [1080, 720, 480, 360, 240, 144];

function VideoResolutionComponent({
  setIsLoading,
  setSearchParams,
  transformedUrl,
  setTransformedUrl,
  searchParams,
}: VideoResolutionComponentProps) {
  const onCreateVideoHLS = async (file: File | null) => {
    const type = "video-res";
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
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const onSelectHLSResolution = async (res: number) => {
    setIsLoading(true);
    const type = "video-res";
    const fileName = searchParams.get("fileName") || "";
    try {
      console.log("starting");
      await getTransformedData(
        type,
        "mp4",
        `${fileName}-${res}p.mp4`,
        Boolean(transformedUrl),
        setTransformedUrl,
        true
      );
      console.log("ending");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return searchParams.get("fileName") ? (
    <div className="w-full flex items-center justify-center flex-col gap-y-5">
      <div className="flex items-center justify-between w-1/2">
        {resolutions.map((e) => (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onSelectHLSResolution(e)}
            key={e}
          >
            {e}
          </Button>
        ))}
      </div>
      {transformedUrl && (
        <video
          src={transformedUrl}
          autoPlay
          controls
          height="300px"
          width="600px"
        />
      )}
    </div>
  ) : (
    <ImageUploader onUpload={onCreateVideoHLS} fileType="video" />
  );
}

export default VideoResolutionComponent;

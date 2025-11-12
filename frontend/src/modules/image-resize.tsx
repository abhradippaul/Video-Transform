import { useState, type Dispatch, type SetStateAction } from "react";
import ImageUploader from "./video-upload";
import {
  getS3UploadData,
  getTransformedData,
  uploadRawData,
} from "@/lib/api-call";
import type { SetURLSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ImageResizeComponentProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setSearchParams: SetURLSearchParams;
  transformedUrl: string | null | undefined;
  setTransformedUrl: Dispatch<SetStateAction<string>>;
}

interface Obj {
  format: string;
  height: number;
  width: number;
  quality: number;
}

function ImageResizeComponent({
  setIsLoading,
  setSearchParams,
  transformedUrl,
  setTransformedUrl,
}: ImageResizeComponentProps) {
  const [obj, setObj] = useState<Obj>({
    format: "auto",
    height: 200,
    width: 200,
    quality: 50,
  });
  const onCreateVideoGif = async (file: File | null) => {
    const type = "image-resize";
    console.log("Uploading");
    try {
      setIsLoading(true);
      if (file && type) {
        const mime = file.type.split("/")[1];
        if (mime) {
          const s3UploadData = await getS3UploadData(mime, type);
          if (s3UploadData) {
            setSearchParams((prev) => {
              prev.set("fileName", `${s3UploadData.fileName}`);
              prev.set("format", `${obj.format}`);
              prev.set("height", `${obj.height}`);
              prev.set("width", `${obj.width}`);
              prev.set("quality", `${obj.quality}`);
              return prev;
            });
            await uploadRawData(s3UploadData.url, file);
            await getTransformedData(
              type,
              mime,
              `${s3UploadData.fileName}`,
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
    <div className="w-full">
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white rounded-2xl shadow-md">
        {/* Format */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="format" className="text-sm font-medium text-gray-700">
            Format
          </label>
          <input
            id="format"
            type="text"
            value={obj?.format}
            onChange={(e) =>
              setObj((prev) => ({
                ...prev,
                format: e.target.value,
              }))
            }
            placeholder="e.g. webp, jpeg"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Height */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="height" className="text-sm font-medium text-gray-700">
            Height
          </label>
          <input
            id="height"
            type="number"
            value={obj?.height}
            onChange={(e) =>
              setObj((prev) => ({
                ...prev,
                height: Number(e.target.value),
              }))
            }
            placeholder="e.g. 1080"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Width */}
        <div className="flex flex-col space-y-2">
          <label htmlFor="width" className="text-sm font-medium text-gray-700">
            Width
          </label>
          <input
            id="width"
            type="number"
            value={obj?.width}
            onChange={(e) =>
              setObj((prev) => ({
                ...prev,
                width: Number(e.target.value),
              }))
            }
            placeholder="e.g. 1920"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Quality */}
        <div className="flex flex-col space-y-2">
          <label
            htmlFor="quality"
            className="text-sm font-medium text-gray-700"
          >
            Quality
          </label>
          <input
            id="quality"
            type="number"
            value={obj?.quality}
            onChange={(e) =>
              setObj((prev) => ({
                ...prev,
                quality: Number(e.target.value),
              }))
            }
            placeholder="e.g. 80"
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </form>

      <ImageUploader onUpload={onCreateVideoGif} fileType="image" />
    </div>
  );
}

export default ImageResizeComponent;

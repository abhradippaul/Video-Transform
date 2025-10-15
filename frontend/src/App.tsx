import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import ImageUploader from "./modules/video-upload";
import axios from "axios";
import { useState } from "react";
import { useS3PutUrl } from "./custom-hooks/presigned-url/use-s3Url";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const s3PutUrl = useS3PutUrl();

  const onCreateVideoThumbnail = async (file: File | null) => {
    const type = searchParams.get("type");
    try {
      setIsLoading(true);
      if (file && type) {
        const mime = file.type.split("/")[1];
        if (mime) {
          s3PutUrl.mutate({ mime, type });
          if (s3PutUrl.data?.data?.url) {
            console.log(s3PutUrl.data?.data?.fileName);
            setSearchParams((prev) => {
              prev.set("fileName", s3PutUrl.data?.data?.fileName);
              return prev;
            });
            await axios.put(s3PutUrl.data?.data?.url, file, {
              headers: {
                "Content-Type": file.type || "application/octet-stream",
              },
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-[900px] w-[90%] h-[500px] flex items-center justify-center flex-col">
        <h1 className="font-medium text-2xl text-muted-foreground ">
          Select an option
        </h1>
        <div className="size-full flex items-center justify-between">
          <Button
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("type", "thumbnail");
                return prev;
              });
            }}
          >
            Create Thumbnail
          </Button>
          <Button
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("type", "gif");
                return prev;
              });
            }}
          >
            Create GIF
          </Button>
          <Button
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("type", "hls");
                return prev;
              });
            }}
          >
            Create HLS Video
          </Button>
          <Button
            onClick={() => {
              setSearchParams((prev) => {
                prev.set("type", "image-resize");
                return prev;
              });
            }}
          >
            Image Resize
          </Button>
          <Button>Click me</Button>
        </div>
        {searchParams.get("type") &&
          (isLoading ? (
            <h1>Loading...</h1>
          ) : (
            <ImageUploader onUpload={onCreateVideoThumbnail} />
          ))}
      </div>
    </div>
  );
}

export default App;

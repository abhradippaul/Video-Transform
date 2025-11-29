import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Thumbnail from "./modules/thumbnail";
import GifComponent from "./modules/gif";
import HLSComponent from "./modules/hls";
import VideoResolutionComponent from "./modules/video-resolution";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [transformedUrl, setTransformedUrl] = useState("");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-[900px] w-[90%] h-[500px] flex items-center justify-center flex-col gap-y-4">
        <h1 className="font-medium text-2xl text-muted-foreground ">
          Select an option
        </h1>
        <div className="size-full flex items-center justify-between">
          <Button
            onClick={() => {
              setTransformedUrl("");
              setSearchParams({ type: "thumbnail" });
            }}
          >
            Create Thumbnail
          </Button>
          <Button
            onClick={() => {
              setTransformedUrl("");
              setSearchParams({ type: "gif" });
            }}
          >
            Create GIF
          </Button>
          <Button
            onClick={() => {
              setTransformedUrl("");
              setSearchParams({ type: "hls" });
            }}
          >
            Create HLS Video
          </Button>
          {/* <Button
            onClick={() => {
              setTransformedUrl("");
              setSearchParams({ type: "image-resize" });
            }}
          >
            Image Resize
          </Button> */}
          <Button
            onClick={() => {
              setTransformedUrl("");
              setSearchParams({ type: "video-res" });
            }}
          >
            Video Resolution
          </Button>
        </div>

        {isLoading && <h1>Loading....</h1>}

        {searchParams.get("type") === "thumbnail" && !isLoading && (
          <Thumbnail
            setIsLoading={setIsLoading}
            setSearchParams={setSearchParams}
            setTransformedUrl={setTransformedUrl}
            transformedUrl={transformedUrl}
          />
        )}
        {searchParams.get("type") === "gif" && !isLoading && (
          <GifComponent
            setIsLoading={setIsLoading}
            setSearchParams={setSearchParams}
            setTransformedUrl={setTransformedUrl}
            transformedUrl={transformedUrl}
          />
        )}
        {searchParams.get("type") === "hls" && !isLoading && (
          <HLSComponent
            setIsLoading={setIsLoading}
            setSearchParams={setSearchParams}
            setTransformedUrl={setTransformedUrl}
            transformedUrl={transformedUrl}
            searchParams={searchParams}
            isLoading={isLoading}
          />
        )}
        {/* {searchParams.get("type") === "image-resize" && !isLoading && (
          <ImageResizeComponent
            setIsLoading={setIsLoading}
            setSearchParams={setSearchParams}
            setTransformedUrl={setTransformedUrl}
            transformedUrl={transformedUrl}
          />
        )} */}
        {searchParams.get("type") === "video-res" && !isLoading && (
          <VideoResolutionComponent
            setIsLoading={setIsLoading}
            setSearchParams={setSearchParams}
            setTransformedUrl={setTransformedUrl}
            transformedUrl={transformedUrl}
            isLoading={isLoading}
            searchParams={searchParams}
          />
        )}
      </div>
    </div>
  );
}

export default App;

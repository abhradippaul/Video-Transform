import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import Thumbnail from "./modules/thumbnail";
import GifComponent from "./modules/gif";
import HLSComponent from "./modules/hls";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [transformedUrl, setTransformedUrl] = useState("");

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-[900px] w-[90%] h-[500px] flex items-center justify-center flex-col">
        <h1 className="font-medium text-2xl text-muted-foreground ">
          Select an option
        </h1>
        <div className="size-full flex items-center justify-between">
          <Button
            onClick={() => {
              setTransformedUrl("");
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
              setTransformedUrl("");
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
              setTransformedUrl("");
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
              setTransformedUrl("");
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
          />
        )}
      </div>
    </div>
  );
}

export default App;

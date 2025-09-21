import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="max-w-[900px] w-[90%] h-[500px]  flex items-center justify-center flex-col">
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
          <Button>Create GIF</Button>
          <Button>Click me</Button>
          <Button>Click me</Button>
          <Button>Click me</Button>
        </div>
      </div>
    </div>
  );
}

export default App;

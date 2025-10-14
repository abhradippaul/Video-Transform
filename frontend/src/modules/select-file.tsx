import React, { useRef, useState, useCallback } from "react";
import type { ChangeEvent, DragEvent } from "react";

type VideoUploaderProps = {
  maxFiles?: number;
  maxSizeMB?: number;
  multiple?: boolean;
  onChange?: (files: File[]) => void;
  accept?: string;
};

type VideoItem = {
  file: File;
  url: string;
};

/**
 * VideoUploader (TypeScript + Tailwind)
 * Drag & drop + click-to-select video upload component with preview and validation.
 */
export default function VideoUploader({
  maxFiles = 3,
  maxSizeMB = 100,
  multiple = true,
  onChange,
  accept = "video/*",
}: VideoUploaderProps) {
  const [files, setFiles] = useState<VideoItem[]>([]);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const clearError = () => setTimeout(() => setError(""), 3500);

  const validateAndAdd = useCallback(
    (incomingFiles: FileList | File[]) => {
      const allowed = Array.from(incomingFiles).filter((f) =>
        f.type.startsWith("video/")
      );
      if (allowed.length === 0) {
        setError("No video files detected.");
        clearError();
        return;
      }

      const tooLarge = allowed.filter((f) => f.size > maxSizeMB * 1024 * 1024);
      if (tooLarge.length) {
        setError(`One or more videos exceed ${maxSizeMB} MB.`);
        clearError();
        return;
      }

      const willFit = Math.min(allowed.length, maxFiles - files.length);
      if (willFit <= 0) {
        setError(`Maximum of ${maxFiles} videos allowed.`);
        clearError();
        return;
      }

      const toAdd: VideoItem[] = allowed
        .slice(0, willFit)
        .map((file) => ({ file, url: URL.createObjectURL(file) }));
      const next = multiple ? [...files, ...toAdd] : [...toAdd];
      setFiles(next);
      onChange?.(next.map((x) => x.file));
    },
    [files, maxFiles, maxSizeMB, multiple, onChange]
  );

  const handleFiles = (
    e: ChangeEvent<HTMLInputElement> | FileList | File[]
  ) => {
    const incoming = ("target" in e ? e.target.files : e) as
      | FileList
      | File[]
      | null;
    if (!incoming) return;
    validateAndAdd(incoming);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const dt = ev.dataTransfer;
    if (dt && dt.files) handleFiles(dt.files);
  };

  const handleDragOver = (ev: DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "copy";
  };

  const removeAt = (index: number) => {
    const next = files.filter((_, i) => i !== index);
    if (files[index]) URL.revokeObjectURL(files[index].url);
    setFiles(next);
    onChange?.(next.map((x) => x.file));
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload videos
      </label>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={
          "relative rounded-lg border-2 border-dashed p-6 flex flex-col items-center justify-center transition-colors " +
          (error
            ? "border-red-400 bg-red-50"
            : "border-gray-200 bg-white hover:border-gray-300")
        }
      >
        {/* Hidden file input for programmatic click */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleFiles}
        />

        <div className="pointer-events-none text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-12 w-12 text-gray-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V8.414A2 2 0 0016.414 7L13 3.586A2 2 0 0011.586 3H4z" />
          </svg>

          <p className="mt-2 text-sm text-gray-600">
            Drag & drop videos here, or
          </p>

          {/* Use label to ensure click works even if parent has pointer-events-none */}
          {/* <label
            htmlFor="video-uploader-input"
            className="mt-3 inline-flex cursor-pointer items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Select videos
          </label> */}
          <input
            id="video-uploader-input"
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            // className="hidden"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
            onChange={handleFiles}
          />

          <p className="mt-2 text-xs text-gray-400">
            MP4, WebM, etc. — up to {maxSizeMB}MB each — max {maxFiles} files
          </p>
        </div>

        {error && (
          <div className="absolute top-2 right-2 text-xs text-red-600">
            {error}
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {files.map((it, idx) => (
            <div
              key={idx}
              className="relative rounded-md overflow-hidden border"
            >
              <video
                src={it.url}
                controls
                className="object-cover w-full h-40"
              />

              <div className="absolute top-1 left-1 px-2 py-0.5 rounded bg-black bg-opacity-40 text-white text-xs">
                {it.file.name}
              </div>

              <button
                onClick={() => removeAt(idx)}
                className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 hover:bg-opacity-100"
                title="Remove"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

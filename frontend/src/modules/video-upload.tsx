import type { DragEvent, ChangeEvent } from "react";

import React, { useState } from "react";

interface VideoUploadProps {
  onUpload: (file: File | null) => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onUpload }) => {
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    // if (file && file.type.startsWith("video/")) {
    //   setSelectedFile(file);
    //   // onUpload(file);
    // } else {
    //   alert("Please drop a valid video file.");
    // }
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // if (file && file.type.startsWith("video/")) {
    //   setSelectedFile(file);
    //   // onUpload(file);
    // } else {
    //   alert("Please select a valid video file.");
    // }
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
  };

  const handleUpload = () => {
    onUpload(selectedFile);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow-md bg-white text-center">
      <h2 className="text-xl font-semibold mb-4">Upload Your Image or Video</h2>

      {/* Upload Zone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 cursor-pointer transition ${
            dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
          }`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <p className="text-gray-500">
            {dragging
              ? "Drop your video here..."
              : "Drag & drop a video file, or click to browse"}
          </p>
        </div>
      ) : (
        <div>
          {/* Video Preview */}
          {selectedFile.type.split("/")[0] === "video" && (
            <video
              controls
              className="rounded-lg w-full max-h-64 border mb-4"
              src={URL.createObjectURL(selectedFile)}
            />
          )}

          {selectedFile.type.split("/")[0] === "image" && (
            <img
              className="rounded-lg w-full object-cover max-h-64 border mb-4"
              src={URL.createObjectURL(selectedFile)}
            />
          )}

          <p className="text-sm text-gray-700 mb-2">
            <strong>File:</strong> {selectedFile.name} <br />
            <strong>Size:</strong>{" "}
            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>

          <div className="flex flex-col gap-y-4 items-center justify-center">
            {/* Remove Button */}
            {selectedFile && (
              <button
                onClick={handleRemove}
                className="bg-red-500 w-1/2 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Remove{" "}
                {selectedFile.type.split("/")[0] === "image"
                  ? "Image"
                  : "Video"}
              </button>
            )}

            {/* Upload Button */}
            {selectedFile && (
              <button
                onClick={handleUpload}
                className="bg-blue-600 w-1/2 cursor-pointer text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
              >
                Upload{" "}
                {selectedFile.type.split("/")[0] === "image"
                  ? "Image"
                  : "Video"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id="fileInput"
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default VideoUpload;

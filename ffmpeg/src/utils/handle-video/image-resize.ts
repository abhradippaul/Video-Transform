import sharp from "sharp";

interface ImageOptions {
  format?: string;
  height?: number;
  width?: number;
  quality?: number;
}

export async function generateImageResize(
  inputPath: string,
  outputPath: string,
  options: ImageOptions = {}
) {
  const { format = "jpeg", height, width, quality = 75 } = options;

  return await sharp(inputPath)
    .resize(width, height, { fit: "cover" })
    .toFormat(format as keyof sharp.FormatEnum, { quality })
    .toFile(outputPath);
}

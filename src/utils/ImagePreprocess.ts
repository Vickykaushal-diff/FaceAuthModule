import { MODEL_CONFIG } from './Constants';

// Crop face region from full image
export const cropFaceRegion = (
  imageData: number[],
  imageWidth: number,
  imageHeight: number,
  faceBox: { x: number; y: number; width: number; height: number }
): number[] => {
  const croppedPixels: number[] = [];

  const startX = Math.max(0, Math.floor(faceBox.x));
  const startY = Math.max(0, Math.floor(faceBox.y));
  const endX = Math.min(imageWidth, Math.floor(faceBox.x + faceBox.width));
  const endY = Math.min(imageHeight, Math.floor(faceBox.y + faceBox.height));

  for (let y = startY; y < endY; y++) {
    for (let x = startX; x < endX; x++) {
      const idx = (y * imageWidth + x) * 3; // RGB
      croppedPixels.push(imageData[idx]);     // R
      croppedPixels.push(imageData[idx + 1]); // G
      croppedPixels.push(imageData[idx + 2]); // B
    }
  }

  return croppedPixels;
};

// Resize image to 160x160 (FaceNet input size)
export const resizeImage = (
  imageData: number[],
  srcWidth: number,
  srcHeight: number,
  targetSize: number = MODEL_CONFIG.INPUT_SIZE
): number[] => {
  const resized: number[] = new Array(targetSize * targetSize * 3);
  const xRatio = srcWidth / targetSize;
  const yRatio = srcHeight / targetSize;

  for (let y = 0; y < targetSize; y++) {
    for (let x = 0; x < targetSize; x++) {
      const srcX = Math.floor(x * xRatio);
      const srcY = Math.floor(y * yRatio);
      const srcIdx = (srcY * srcWidth + srcX) * 3;
      const dstIdx = (y * targetSize + x) * 3;

      resized[dstIdx] = imageData[srcIdx];
      resized[dstIdx + 1] = imageData[srcIdx + 1];
      resized[dstIdx + 2] = imageData[srcIdx + 2];
    }
  }

  return resized;
};

// Normalize pixel values to [-1, 1] for FaceNet
export const normalizePixels = (imageData: number[]): number[] => {
  return imageData.map(pixel => (pixel - 127.5) / 127.5);
};

// Convert RGB to grayscale
export const toGrayscale = (imageData: number[]): number[] => {
  const grayscale: number[] = [];
  for (let i = 0; i < imageData.length; i += 3) {
    const gray = 0.299 * imageData[i] +
                 0.587 * imageData[i + 1] +
                 0.114 * imageData[i + 2];
    grayscale.push(gray);
  }
  return grayscale;
};

// Full pipeline — crop → resize → normalize
export const preprocessFace = (
  imageData: number[],
  imageWidth: number,
  imageHeight: number,
  faceBox: { x: number; y: number; width: number; height: number }
): number[] => {
  console.log('⏳ Preprocessing face image...');

  // Step 1 — Crop face
  const cropped = cropFaceRegion(imageData, imageWidth, imageHeight, faceBox);

  // Step 2 — Resize to 160x160
  const resized = resizeImage(
    cropped,
    Math.floor(faceBox.width),
    Math.floor(faceBox.height),
    MODEL_CONFIG.INPUT_SIZE
  );

  // Step 3 — Normalize
  const normalized = normalizePixels(resized);

  console.log(`✅ Preprocessed: ${normalized.length} values`);
  return normalized;
};
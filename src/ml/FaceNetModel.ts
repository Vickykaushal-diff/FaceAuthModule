import { loadTFLiteModel, TFLiteModel } from 'react-native-fast-tflite';
import { MODEL_CONFIG } from '../utils/Constants';

let model: TFLiteModel | null = null;

// Load TFLite model
export const loadFaceNetModel = async (): Promise<boolean> => {
  try {
    console.log('⏳ Loading FaceNet model...');
    model = await loadTFLiteModel(MODEL_CONFIG.MODEL_PATH);
    console.log('✅ FaceNet model loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Model load failed:', error);
    return false;
  }
};

// Preprocess image — normalize to [-1, 1]
const preprocessImage = (imageData: number[]): Float32Array => {
  const float32 = new Float32Array(imageData.length);
  for (let i = 0; i < imageData.length; i++) {
    float32[i] = (imageData[i] - 127.5) / 127.5;
  }
  return float32;
};

// Run inference — get 128D embedding
export const getEmbedding = async (imageData: number[]): Promise<number[] | null> => {
  try {
    if (!model) {
      console.error('❌ Model not loaded. Call loadFaceNetModel() first.');
      return null;
    }

    const input = preprocessImage(imageData);
    const output = await model.run([input]);

    // Convert to regular array
    const embedding = Array.from(output[0] as Float32Array);
    console.log(`✅ Embedding generated: ${embedding.length}D vector`);
    return embedding;
  } catch (error) {
    console.error('❌ Inference failed:', error);
    return null;
  }
};

// Check if model is loaded
export const isModelLoaded = (): boolean => model !== null;

// Unload model — free memory
export const unloadModel = (): void => {
  model = null;
  console.log('✅ Model unloaded');
};
import { getEmbedding } from './FaceNetModel';
import { findBestMatch } from './CosineSimilarity';
import { saveEmbedding, getAllEmbeddings } from '../database/EmbeddingStore';
import { saveLog } from '../database/AttendanceLogs';

// Register a new face
export const registerFace = async (
  employeeId: string,
  imageData: number[]
): Promise<{ success: boolean; message: string }> => {
  try {
    console.log(`⏳ Registering face for ${employeeId}...`);

    // Step 1 — Generate embedding
    const embedding = await getEmbedding(imageData);
    if (!embedding) {
      return { success: false, message: 'Failed to generate face embedding' };
    }

    // Step 2 — Save to SQLite
    const saved = saveEmbedding(employeeId, embedding);
    if (!saved) {
      return { success: false, message: 'Failed to save embedding to database' };
    }

    console.log(`✅ Face registered for ${employeeId}`);
    return { success: true, message: `Face registered successfully for ${employeeId}` };
  } catch (error) {
    console.error('❌ Registration failed:', error);
    return { success: false, message: 'Registration failed due to an error' };
  }
};

// Authenticate a face
export const authenticateFace = async (
  imageData: number[]
): Promise<{ success: boolean; employeeId?: string; score?: number; message: string }> => {
  try {
    console.log('⏳ Authenticating face...');

    // Step 1 — Generate embedding
    const queryEmbedding = await getEmbedding(imageData);
    if (!queryEmbedding) {
      return { success: false, message: 'Failed to generate face embedding' };
    }

    // Step 2 — Fetch all stored embeddings
    const storedEmbeddings = getAllEmbeddings();
    if (storedEmbeddings.length === 0) {
      return { success: false, message: 'No registered faces found' };
    }

    // Step 3 — Find best match
    const match = findBestMatch(queryEmbedding, storedEmbeddings);

    if (match) {
      // Step 4 — Log success
      saveLog(match.employeeId, 'success');
      return {
        success: true,
        employeeId: match.employeeId,
        score: match.score,
        message: `Authenticated as ${match.employeeId}`,
      };
    } else {
      // Step 4 — Log failure
      saveLog('UNKNOWN', 'failed');
      return { success: false, message: 'Face not recognized' };
    }
  } catch (error) {
    console.error('❌ Authentication failed:', error);
    return { success: false, message: 'Authentication failed due to an error' };
  }
};
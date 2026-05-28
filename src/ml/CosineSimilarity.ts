import { MODEL_CONFIG } from '../utils/Constants';

// Cosine similarity between two 128D vectors
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// Check if two faces match
export const isFaceMatch = (vecA: number[], vecB: number[]): boolean => {
  const similarity = cosineSimilarity(vecA, vecB);
  console.log(`🔍 Similarity score: ${similarity.toFixed(4)}`);
  return similarity >= MODEL_CONFIG.SIMILARITY_THRESHOLD;
};

// Find best match from all stored embeddings
export const findBestMatch = (
  queryEmbedding: number[],
  storedEmbeddings: { employeeId: string; embedding: number[] }[]
): { employeeId: string; score: number } | null => {
  if (storedEmbeddings.length === 0) return null;

  let bestMatch = { employeeId: '', score: 0 };

  for (const stored of storedEmbeddings) {
    const score = cosineSimilarity(queryEmbedding, stored.embedding);
    if (score > bestMatch.score) {
      bestMatch = { employeeId: stored.employeeId, score };
    }
  }

  // Return only if above threshold
  if (bestMatch.score >= MODEL_CONFIG.SIMILARITY_THRESHOLD) {
    console.log(`✅ Best match: ${bestMatch.employeeId} (${bestMatch.score.toFixed(4)})`);
    return bestMatch;
  }

  console.log('❌ No match found');
  return null;
};
// ─── Model Config ───────────────────────────────────────
export const MODEL_CONFIG = {
  MODEL_PATH: 'assets/models/facenet.tflite',
  INPUT_SIZE: 160,           // FaceNet input: 160x160
  EMBEDDING_SIZE: 128,       // 128D vector output
  SIMILARITY_THRESHOLD: 0.75 // Cosine similarity cutoff
};

// ─── Liveness Config ────────────────────────────────────
export const LIVENESS_CONFIG = {
  BLINK_THRESHOLD: 0.25,     // EAR ratio for blink
  CHALLENGES: ['BLINK', 'SMILE', 'TURN_LEFT', 'TURN_RIGHT'],
  CHALLENGE_TIMEOUT_MS: 5000 // 5 sec to complete challenge
};

// ─── Database Config ────────────────────────────────────
export const DB_CONFIG = {
  DB_NAME: 'FaceAuth.db',
  EMBEDDINGS_TABLE: 'embeddings',
  LOGS_TABLE: 'attendance_logs'
};

// ─── Sync Config ────────────────────────────────────────
export const SYNC_CONFIG = {
  AWS_API_URL: 'https://your-api-gateway-url.amazonaws.com/prod',
  SYNC_ENDPOINT: '/sync',
  RETRY_ATTEMPTS: 3
};

// ─── App Config ─────────────────────────────────────────
export const APP_CONFIG = {
  APP_NAME: 'FaceAuth',
  VERSION: '1.0.0',
  MAX_REGISTER_ATTEMPTS: 3,
  MAX_AUTH_ATTEMPTS: 3
};
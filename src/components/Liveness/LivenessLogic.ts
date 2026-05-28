import { LIVENESS_CONFIG } from '../../utils/Constants';

export type LivenessChallenge = 'BLINK' | 'SMILE' | 'TURN_LEFT' | 'TURN_RIGHT';

export type FaceLandmarks = {
  leftEye: { x: number; y: number }[];
  rightEye: { x: number; y: number }[];
  mouth: { x: number; y: number }[];
  nose: { x: number; y: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
};

// ─── EAR (Eye Aspect Ratio) — Blink Detection ───────────
const getEAR = (eye: { x: number; y: number }[]): number => {
  if (eye.length < 6) return 1;

  // Vertical distances
  const v1 = Math.abs(eye[1].y - eye[5].y);
  const v2 = Math.abs(eye[2].y - eye[4].y);

  // Horizontal distance
  const h = Math.abs(eye[0].x - eye[3].x);

  if (h === 0) return 1;
  return (v1 + v2) / (2 * h);
};

// ─── Blink Detection ────────────────────────────────────
export const detectBlink = (landmarks: FaceLandmarks): boolean => {
  const leftEAR = getEAR(landmarks.leftEye);
  const rightEAR = getEAR(landmarks.rightEye);
  const avgEAR = (leftEAR + rightEAR) / 2;

  console.log(`👁️ EAR: ${avgEAR.toFixed(3)}`);
  return avgEAR < LIVENESS_CONFIG.BLINK_THRESHOLD;
};

// ─── Smile Detection ────────────────────────────────────
export const detectSmile = (landmarks: FaceLandmarks): boolean => {
  if (landmarks.mouth.length < 2) return false;

  const mouthWidth = Math.abs(
    landmarks.mouth[0].x - landmarks.mouth[1].x
  );
  const faceWidth = Math.abs(
    landmarks.leftCheek.x - landmarks.rightCheek.x
  );

  if (faceWidth === 0) return false;

  const smileRatio = mouthWidth / faceWidth;
  console.log(`😊 Smile ratio: ${smileRatio.toFixed(3)}`);

  // Smile if mouth is > 40% of face width
  return smileRatio > 0.4;
};

// ─── Head Turn Detection ─────────────────────────────────
export const detectHeadTurn = (
  landmarks: FaceLandmarks,
  direction: 'TURN_LEFT' | 'TURN_RIGHT'
): boolean => {
  const noseX = landmarks.nose.x;
  const leftCheekX = landmarks.leftCheek.x;
  const rightCheekX = landmarks.rightCheek.x;

  const faceCenter = (leftCheekX + rightCheekX) / 2;
  const turnRatio = (noseX - faceCenter) / (rightCheekX - leftCheekX);

  console.log(`🔄 Turn ratio: ${turnRatio.toFixed(3)}`);

  if (direction === 'TURN_LEFT') return turnRatio < -0.15;
  if (direction === 'TURN_RIGHT') return turnRatio > 0.15;
  return false;
};

// ─── Main Challenge Checker ──────────────────────────────
export const checkChallenge = (
  challenge: LivenessChallenge,
  landmarks: FaceLandmarks
): boolean => {
  switch (challenge) {
    case 'BLINK':
      return detectBlink(landmarks);
    case 'SMILE':
      return detectSmile(landmarks);
    case 'TURN_LEFT':
      return detectHeadTurn(landmarks, 'TURN_LEFT');
    case 'TURN_RIGHT':
      return detectHeadTurn(landmarks, 'TURN_RIGHT');
    default:
      return false;
  }
};

// ─── Get Random Challenge ────────────────────────────────
export const getRandomChallenge = (): LivenessChallenge => {
  const challenges = LIVENESS_CONFIG.CHALLENGES as LivenessChallenge[];
  return challenges[Math.floor(Math.random() * challenges.length)];
};

// ─── Challenge Display Text ──────────────────────────────
export const getChallengeText = (challenge: LivenessChallenge): string => {
  switch (challenge) {
    case 'BLINK': return '👁️ Please Blink';
    case 'SMILE': return '😊 Please Smile';
    case 'TURN_LEFT': return '⬅️ Turn Head Left';
    case 'TURN_RIGHT': return '➡️ Turn Head Right';
    default: return 'Follow the instruction';
  }
};
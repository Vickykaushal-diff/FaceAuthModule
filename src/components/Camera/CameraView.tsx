import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import FaceOverlay from '../UI/FaceOverlay';

type Props = {
  onCapture: (imageData: number[]) => void;
  showLiveness?: boolean;
};

const CameraView = ({ onCapture, showLiveness = false }: Props) => {
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useRef<Camera>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);

  // Request permission if not granted
  if (!hasPermission) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionText}>Camera permission required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // No front camera found
  if (!device) {
    return (
      <View style={styles.permissionBox}>
        <Text style={styles.permissionText}>No front camera found</Text>
      </View>
    );
  }

  // Capture photo
  const capturePhoto = async () => {
    if (!camera.current || isCapturing) return;

    try {
      setIsCapturing(true);
      const photo = await camera.current.takePhoto({ flash: 'off' });
      console.log('📸 Photo captured:', photo.path);

      // TODO: Convert photo to pixel array for FaceNet
      // For now passing empty array — will integrate with ImagePreprocess.ts
      onCapture([]);
    } catch (error) {
      console.error('❌ Capture failed:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Preview */}
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={true}
        photo={true}
      />

      {/* Face Overlay */}
      <FaceOverlay faceDetected={faceDetected} />

      {/* Face Detection Status */}
      <View style={styles.statusBar}>
        <View style={[
          styles.statusDot,
          { backgroundColor: faceDetected ? '#00ff88' : '#ff4444' }
        ]} />
        <Text style={styles.statusText}>
          {faceDetected ? 'Face Detected' : 'No Face Detected'}
        </Text>
      </View>

      {/* Capture Button */}
      <TouchableOpacity
        style={[styles.captureButton, isCapturing && styles.capturing]}
        onPress={capturePhoto}
        disabled={isCapturing}>
        {isCapturing
          ? <ActivityIndicator color="#ffffff" />
          : <Text style={styles.captureText}>📸 Capture</Text>
        }
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  permissionBox: {
    width: '100%',
    height: 350,
    backgroundColor: '#16213e',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#aaaaaa',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0f3460',
    padding: 12,
    borderRadius: 10,
  },
  buttonText: { color: '#ffffff', fontSize: 14 },
  statusBar: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00000088',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: { color: '#ffffff', fontSize: 12 },
  captureButton: {
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    backgroundColor: '#0f3460',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  capturing: { backgroundColor: '#533483' },
  captureText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

export default CameraView;
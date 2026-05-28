import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

type Props = {
  faceDetected: boolean;
};

const FaceOverlay = ({ faceDetected }: Props) => {
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: faceDetected ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [faceDetected]);

  const borderColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ff4444', '#00ff88'],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      {/* Face oval guide */}
      <Animated.View style={[styles.faceOval, { borderColor }]} />

      {/* Corner brackets */}
      <View style={styles.corners}>
        <Animated.View style={[styles.cornerTL, { borderColor }]} />
        <Animated.View style={[styles.cornerTR, { borderColor }]} />
        <Animated.View style={[styles.cornerBL, { borderColor }]} />
        <Animated.View style={[styles.cornerBR, { borderColor }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faceOval: {
    width: 200,
    height: 260,
    borderRadius: 100,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  corners: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTL: {
    position: 'absolute',
    top: '20%',
    left: '15%',
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 2,
  },
  cornerTR: {
    position: 'absolute',
    top: '20%',
    right: '15%',
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderRadius: 2,
  },
  cornerBL: {
    position: 'absolute',
    bottom: '20%',
    left: '15%',
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderRadius: 2,
  },
  cornerBR: {
    position: 'absolute',
    bottom: '20%',
    right: '15%',
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderRadius: 2,
  },
});

export default FaceOverlay;
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

type Props = {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
};

const StatusBanner = ({ message, type, visible }: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const bgColor = {
    success: '#00ff8822',
    error: '#ff444422',
    warning: '#f0a50022',
    info: '#0f346022',
  };

  const textColor = {
    success: '#00ff88',
    error: '#ff4444',
    warning: '#f0a500',
    info: '#4488ff',
  };

  return (
    <Animated.View style={[
      styles.banner,
      { opacity, backgroundColor: bgColor[type], borderColor: textColor[type] }
    ]}>
      <Text style={[styles.text, { color: textColor[type] }]}>
        {message}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default StatusBanner;
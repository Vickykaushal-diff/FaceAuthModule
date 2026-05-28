import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {
  LivenessChallenge,
  getChallengeText,
  getRandomChallenge,
} from './LivenessLogic';
import { LIVENESS_CONFIG } from '../../utils/Constants';

type Props = {
  onSuccess: () => void;
  onFailure: () => void;
};

const LivenessChallengeComponent = ({ onSuccess, onFailure }: Props) => {
  const [challenge, setChallenge] = useState<LivenessChallenge>(getRandomChallenge());
  const [status, setStatus] = useState<'waiting' | 'success' | 'failed'>('waiting');
  const [timeLeft, setTimeLeft] = useState(LIVENESS_CONFIG.CHALLENGE_TIMEOUT_MS / 1000);
  const animValue = new Animated.Value(0);

  // Pulse animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animValue, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animValue, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (status !== 'waiting') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('failed');
          onFailure();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  // Call this from parent when challenge is completed
  const handleChallengeComplete = () => {
    setStatus('success');
    onSuccess();
  };

  const scale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  const statusColor = {
    waiting: '#f0a500',
    success: '#00ff88',
    failed: '#ff4444',
  };

  return (
    <View style={styles.container}>
      {/* Challenge Box */}
      <Animated.View
        style={[
          styles.challengeBox,
          { borderColor: statusColor[status] },
          { transform: [{ scale }] },
        ]}>
        <Text style={styles.challengeEmoji}>
          {status === 'success' ? '✅' : status === 'failed' ? '❌' : '🎯'}
        </Text>
        <Text style={[styles.challengeText, { color: statusColor[status] }]}>
          {status === 'waiting'
            ? getChallengeText(challenge)
            : status === 'success'
            ? 'Liveness Verified!'
            : 'Challenge Failed!'}
        </Text>
      </Animated.View>

      {/* Timer */}
      {status === 'waiting' && (
        <View style={styles.timerBox}>
          <Text style={styles.timerText}>{timeLeft}s</Text>
          <View style={styles.timerBar}>
            <View
              style={[
                styles.timerFill,
                {
                  width: `${(timeLeft / (LIVENESS_CONFIG.CHALLENGE_TIMEOUT_MS / 1000)) * 100}%`,
                  backgroundColor: timeLeft > 3 ? '#00ff88' : '#ff4444',
                },
              ]}
            />
          </View>
        </View>
      )}

      {/* Instruction */}
      {status === 'waiting' && (
        <Text style={styles.instruction}>
          Complete the challenge to verify you are a real person
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
  },
  challengeBox: {
    width: '100%',
    backgroundColor: '#16213e',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    marginBottom: 16,
  },
  challengeEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  challengeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  timerBox: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 6,
  },
  timerBar: {
    width: '100%',
    height: 6,
    backgroundColor: '#16213e',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    borderRadius: 3,
  },
  instruction: {
    color: '#aaaaaa',
    fontSize: 12,
    textAlign: 'center',
  },
});

export default LivenessChallengeComponent;
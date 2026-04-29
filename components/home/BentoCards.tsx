import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export const BentoCards = () => {
  const slideAnim1 = useRef(new Animated.Value(50)).current;
  const slideAnim2 = useRef(new Animated.Value(50)).current;
  const opacityAnim1 = useRef(new Animated.Value(0)).current;
  const opacityAnim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animasi card pertama
    Animated.parallel([
      Animated.timing(slideAnim1, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim1, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animasi card kedua (delay)
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(slideAnim2, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim2, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 150);
  }, [slideAnim1, slideAnim2, opacityAnim1, opacityAnim2]);

  return (
    <View style={styles.grid}>
      <Animated.View 
        style={[
          styles.card, 
          { 
            backgroundColor: Colors.surfaceContainerLow,
            transform: [{ translateY: slideAnim1 }],
            opacity: opacityAnim1,
          }
        ]}
      >
        <MaterialIcons name="auto-stories" size={32} color={Colors.secondary} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Time Capsule</Text>
          <Text style={styles.cardDesc}>
            Revisit the emotional landscape of your past self through archived strokes.
          </Text>
        </View>
      </Animated.View>

      <Animated.View 
        style={[
          styles.card, 
          { 
            backgroundColor: Colors.surfaceContainerHigh,
            transform: [{ translateY: slideAnim2 }],
            opacity: opacityAnim2,
          }
        ]}
      >
        <MaterialIcons name="bubble-chart" size={32} color={Colors.primary} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Canvas Flow</Text>
          <Text style={styles.cardDesc}>
            A seamless, AI-assisted meditative drawing experience tailored to your mood.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { width: '100%', gap: 32, marginBottom: 40 },
  card: { padding: 32, borderRadius: 24, gap: 16, minHeight: 160 },
  cardText: { gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: '500', color: Colors.onSurface },
  cardDesc: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
});
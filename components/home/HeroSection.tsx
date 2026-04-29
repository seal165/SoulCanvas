import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';
import { Colors } from '@/constants/Colors';

const IMAGE_URL = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnepVMPtd3xXkCXjBoyxojIcRzopmGXUd15AK9YtDffdYuLgyAmhRZekAhpGNlgUvdzDFUvvsp6LNk46KuMSFscge2Tz56AxhB7gmenA1mlJSgKcJzRSEQlT-U4cIVPZ2rAXVaRnVoauJJ9XwO-fBGt-r-biMwmdoovVMITqRPIdDYzi_AW-BM3FhH-97Dy75DJF8BNDgrVnn6gZz8P0lWV9pxCORdMHiytujtTiAynGn7dFta7z3bThJBr0I1DR-r0Cvsk9ThTbtY';

export const HeroSection = () => {
  // Animasi Fade In
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  // Animasi Pulse untuk chip
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }
      ]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.label}>Emotional Reflection</Text>
        <Text style={styles.title}>
          What does your heart{' '}
          <Text style={styles.italic}>look like today?</Text>
        </Text>
      </View>
      <View style={styles.imageContainer}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: IMAGE_URL }} style={styles.image} resizeMode="cover" />
        </View>
        <Animated.View style={[styles.chip, { transform: [{ scale: pulseAnim }] }]}>
          <View style={styles.chipDot} />
          <Text style={styles.chipText}>Currently Reflecting</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center', marginBottom: 48 },
  textContainer: { alignItems: 'center', marginBottom: 48 },
  label: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: Colors.secondary,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: '300',
    letterSpacing: -0.72,
    textAlign: 'center',
    color: Colors.onSurface,
    lineHeight: 44,
  },
  italic: { fontStyle: 'italic', fontWeight: '400' },
  imageContainer: { width: '100%', maxWidth: 448, aspectRatio: 16 / 10, position: 'relative' },
  imageWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLowest,
    shadowColor: '#1c1c17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  image: { width: '100%', height: '100%', opacity: 0.9 },
  chip: {
    position: 'absolute',
    top: 24,
    left: 24,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 8,
  },
  chipDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondaryFixedDim },
  chipText: { fontSize: 12, fontWeight: '500', color: Colors.onSurfaceVariant },
});
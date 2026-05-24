import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { session, loading } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      if (!loading) {
        if (session) router.replace('/(tabs)');
        else router.replace('/(tabs)/login');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, loading, session, router]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      
      {/* Background Elements */}
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />
      
      {/* Animated Content */}
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <MaterialIcons name="auto-awesome" size={56} color={Colors.secondary} />
        </View>
        
        <Text style={styles.title}>SoulCanvas</Text>
        <Text style={styles.subtitle}>Every feeling deserves a shape</Text>
        
        <View style={styles.divider} />
      </Animated.View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Curating your inner exhibition</Text>
        <MaterialIcons name="expand-more" size={20} color={Colors.secondary} style={styles.bounceIcon} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgTop: {
    position: 'absolute',
    top: '15%',
    left: '-5%',
    width: '60%',
    height: '40%',
    borderRadius: 999,
    backgroundColor: `${Colors.secondaryContainer}25`,
    transform: [{ scale: 1 }],
  },
  bgBottom: {
    position: 'absolute',
    bottom: '10%',
    right: '-5%',
    width: '50%',
    height: '35%',
    borderRadius: 999,
    backgroundColor: `${Colors.primaryContainer}15`,
    transform: [{ scale: 1 }],
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    borderRadius: 32,
    marginBottom: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 48,
    fontWeight: '300',
    letterSpacing: -1,
    color: Colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '200',
    fontStyle: 'italic',
    color: `${Colors.onSurfaceVariant}B3`,
    textAlign: 'center',
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: `${Colors.outline}40`,
    marginTop: 48,
  },
  footer: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
    color: Colors.onSurfaceVariant,
    opacity: 0.5,
  },
  bounceIcon: {
    opacity: 0.5,
  },
});
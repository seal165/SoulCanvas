import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Platform, Animated } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Header, BottomNav } from '@/components/common';
import { HeroSection, ActionButtons, BentoCards } from '@/components/home';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);
  
  // Animasi fade in untuk seluruh konten
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />

      <Animated.ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 32,
            paddingBottom: bottomNavHeight + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        style={{ opacity: fadeAnim }}
      >
        <View style={[styles.bgBlur1, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, right: -width * 0.2, top: width * 0.25 }]} />
        <View style={[styles.bgBlur2, { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, left: -width * 0.2, bottom: width * 0.25 }]} />

        <HeroSection />
        <ActionButtons />
        <BentoCards />
      </Animated.ScrollView>

      <BottomNav activeTab="home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  bgBlur1: { position: 'absolute', backgroundColor: Colors.tertiaryContainer + '33' },
  bgBlur2: { position: 'absolute', backgroundColor: Colors.primaryContainer + '1A' },
});
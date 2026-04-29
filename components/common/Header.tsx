import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { usePathname } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const Header = () => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const headerHeight = insets.top + 80;

  const getTitle = () => {
    if (pathname === '/' || pathname === '/(tabs)') return 'SoulCanvas';
    if (pathname === '/compose') return 'Compose';
    if (pathname === '/gallery') return 'Gallery';
    if (pathname === '/capsule') return 'Time Capsule';
    return 'SoulCanvas';
  };

  return (
    <View style={[styles.header, { top: 0, paddingTop: insets.top, height: headerHeight }]}>
      <TouchableOpacity style={styles.leftIcon} activeOpacity={0.7}>
        <MaterialIcons name="auto-awesome" size={24} color={Colors.primary} />
        <Text style={styles.logoText}>SoulCanvas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{getTitle()}</Text>

      <TouchableOpacity style={styles.rightIcon} activeOpacity={0.7}>
        <Ionicons name="person-circle-outline" size={28} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    backgroundColor: 'rgba(253, 249, 241, 0.7)',
  },
  leftIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoText: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope' : 'sans-serif',
    fontSize: 14,
    fontWeight: '300',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  title: {
    fontFamily: Platform.OS === 'ios' ? 'Manrope' : 'sans-serif',
    fontSize: 24,
    fontWeight: '300',
    letterSpacing: -0.48,
    color: Colors.primary,
  },
  rightIcon: {
    padding: 8,
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export const Header = () => {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;

  return (
    <View style={[styles.header, { top: 0, paddingTop: insets.top, height: headerHeight }]}>
      <TouchableOpacity style={styles.leftIcon} activeOpacity={0.7}>
        <MaterialIcons name="auto-awesome" size={24} color={Colors.primary} />
        <Text style={styles.logoText}>SoulCanvas</Text>
      </TouchableOpacity>

      <Text style={styles.title}>SoulCanvas</Text>

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
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export const BottomNav = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Platform.OS === 'ios' ? insets.bottom + 6 : 16 }]}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.activeItem}>
          <Ionicons name="home" size={28} color={Colors.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveItem}>
          <MaterialIcons name="subscriptions" size={28} color={`${Colors.primary}80`} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveItem}>
          <MaterialIcons name="auto-stories" size={28} color={`${Colors.primary}80`} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    alignItems: 'center',
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 32,
    width: '90%',
    maxWidth: 400,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#1c1c17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  activeItem: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${Colors.secondaryContainer}66`,
    borderRadius: 999,
    padding: 12,
    transform: [{ scale: 0.9 }],
  },
  inactiveItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    transform: [{ scale: 0.9 }],
  },
});
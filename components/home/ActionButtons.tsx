import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export const ActionButtons = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.createButton} 
        activeOpacity={0.8}
        onPress={() => router.push('/(tabs)/compose')}
      >
        <MaterialIcons name="brush" size={24} color={Colors.onPrimary} />
        <Text style={styles.createButtonText}>Start Creating</Text>
      </TouchableOpacity>
      <View style={styles.secondaryRow}>
        <TouchableOpacity 
          style={styles.galleryButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/gallery')}
        >
          <Text style={styles.galleryButtonText}>View Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.historyButton} 
          activeOpacity={0.7}
          onPress={() => router.push('/(tabs)/capsule')}
        >
          <MaterialIcons name="history-toggle-off" size={24} color={Colors.secondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', maxWidth: 320, marginBottom: 40 },
  createButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 20,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
    shadowColor: '#1c1c17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  createButtonText: { fontSize: 18, fontWeight: '500', color: Colors.onPrimary },
  secondaryRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  galleryButton: {
    flex: 1,
    backgroundColor: `${Colors.secondaryContainer}66`,
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: 'center',
  },
  galleryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    color: Colors.onSecondaryContainer,
  },
  historyButton: {
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: Colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
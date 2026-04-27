import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface BottomNavProps {
  activeTab?: 'home' | 'compose' | 'gallery' | 'capsule';
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { bottom: Platform.OS === 'ios' ? insets.bottom + 6 : 16 }]}>
      <View style={styles.inner}>
        {/* Home */}
        <TouchableOpacity style={[styles.navItem, activeTab === 'home' && styles.activeItem]} activeOpacity={0.7}>
          <Ionicons
            name="home"
            size={28}
            color={activeTab === 'home' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        {/* Compose */}
        <TouchableOpacity style={[styles.navItem, activeTab === 'compose' && styles.activeItem]} activeOpacity={0.7}>
          <MaterialIcons
            name="brush"
            size={28}
            color={activeTab === 'compose' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        {/* Gallery */}
        <TouchableOpacity style={[styles.navItem, activeTab === 'gallery' && styles.activeItem]} activeOpacity={0.7}>
          <MaterialIcons
            name="auto-stories"
            size={28}
            color={activeTab === 'gallery' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        {/* Capsule */}
        <TouchableOpacity style={[styles.navItem, activeTab === 'capsule' && styles.activeItem]} activeOpacity={0.7}>
          <MaterialIcons
            name="history"
            size={28}
            color={activeTab === 'capsule' ? Colors.secondary : `${Colors.primary}80`}
          />
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
    maxWidth: 500,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#1c1c17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 24,
    elevation: 4,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 999,
    transform: [{ scale: 0.9 }],
  },
  activeItem: {
    backgroundColor: `${Colors.secondaryContainer}66`,
  },
});
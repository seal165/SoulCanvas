import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type TabRoute = 'home' | 'compose' | 'gallery' | 'capsule';

interface BottomNavProps {
  activeTab?: TabRoute;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const navigateTo = (tab: TabRoute) => {
    switch (tab) {
      case 'home':
        router.push('/(tabs)');
        break;
      case 'compose':
        router.push('/(tabs)/compose');
        break;
      case 'gallery':
        router.push('/(tabs)/gallery');
        break;
      case 'capsule':
        router.push('/(tabs)/capsule');
        break;
    }
  };

  return (
    <View style={[styles.container, { bottom: Platform.OS === 'ios' ? insets.bottom + 16 : 16 }]}>
      <View style={styles.inner}>
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('home')}
        >
          <Ionicons
            name="home"
            size={24}
            color={activeTab === 'home' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'compose' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('compose')}
        >
          <MaterialIcons
            name="brush"
            size={24}
            color={activeTab === 'compose' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'gallery' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('gallery')}
        >
          <MaterialIcons
            name="auto-stories"
            size={24}
            color={activeTab === 'gallery' ? Colors.secondary : `${Colors.primary}80`}
          />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'capsule' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('capsule')}
        >
          <MaterialIcons
            name="history"
            size={24}
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 32,
    width: '90%',
    maxWidth: 500,
    paddingVertical: 8,
    paddingHorizontal: 16,
    shadowColor: '#1c1c17',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 5,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 999,
  },
  activeItem: {
    backgroundColor: `${Colors.secondaryContainer}66`,
  },
});
import React, { useEffect, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, Href } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

type TabRoute = 'home' | 'compose' | 'gallery' | 'capsule' | 'profile';

interface BottomNavProps {
  activeTab?: TabRoute;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab = 'home' }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  
  const translateY = useRef(new Animated.Value(100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacityAnim]);

  const navigateTo = (tab: TabRoute) => {
    switch (tab) {
      case 'home':
        router.push('/(tabs)' as Href);
        break;
      case 'compose':
        router.push('/(tabs)/compose' as Href);
        break;
      case 'gallery':
        router.push('/(tabs)/gallery' as Href);
        break;
      case 'capsule':
        router.push('/(tabs)/capsule' as Href);
        break;
      case 'profile':
        router.push('/(tabs)/profile' as Href);
        break;
    }
  };

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          bottom: Platform.OS === 'ios' ? insets.bottom + 30 : 30,
          transform: [{ translateY }],
          opacity: opacityAnim,
        }
      ]}
    >
      <View style={styles.inner}>
        {/* Home */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'home' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('home')}
        >
          <Ionicons name="home" size={24} color={activeTab === 'home' ? Colors.secondary : `${Colors.primary}80`} />
        </TouchableOpacity>

        {/* Compose */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'compose' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('compose')}
        >
          <MaterialIcons name="brush" size={24} color={activeTab === 'compose' ? Colors.secondary : `${Colors.primary}80`} />
        </TouchableOpacity>

        {/* Gallery */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'gallery' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('gallery')}
        >
          <MaterialIcons name="auto-stories" size={24} color={activeTab === 'gallery' ? Colors.secondary : `${Colors.primary}80`} />
        </TouchableOpacity>

        {/* Capsule */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'capsule' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('capsule')}
        >
          <MaterialIcons name="history" size={24} color={activeTab === 'capsule' ? Colors.secondary : `${Colors.primary}80`} />
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity 
          style={[styles.navItem, activeTab === 'profile' && styles.activeItem]} 
          activeOpacity={0.7}
          onPress={() => navigateTo('profile')}
        >
          <Ionicons name="person-outline" size={24} color={activeTab === 'profile' ? Colors.secondary : `${Colors.primary}80`} />
        </TouchableOpacity>
      </View>
    </Animated.View>
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
    maxWidth: 550,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 999,
  },
  activeItem: {
    backgroundColor: `${Colors.secondaryContainer}66`,
  },
});
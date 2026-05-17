import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';

const PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiDZpI3fbOsPWBUQV5_3Vvu-unru3-0e1o1bHpY9uQaWQ68CpVWdJMaIeimqeEpn6hux2rq-uXkscGQqz26X4O5ygpdE3uHHfQ27oqr69uz6-7UoXXjlEAwDS5KoGKwovjG9s1CyBcFLeNiyDKajl9epDb2KNn92S6C2tKPQGb8fMF2w96YuvNpdPqmmPDCySTmKLnezmJv4b3sEMmsDcunKQRuOxSoK_Wgpb4RxofsQd3jDkoFDMZvpaHcnzfb8YbPJDDFejapsPI';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            // Hapus status login
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('userName');
            // Arahkan ke halaman login
            router.replace('/(tabs)/login' as Href);
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'person-outline', title: 'Account Settings', route: '/(tabs)/account-settings', color: Colors.primary },
    { icon: 'notifications-none', title: 'Notification Preferences', route: '/(tabs)/notification-preferences', color: Colors.primary },
    { icon: 'security', title: 'Privacy & Security', route: '/(tabs)/privacy', color: Colors.primary },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: headerHeight + 20, paddingBottom: bottomNavHeight + 24 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarBorder}>
              <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />
            </View>
            <TouchableOpacity style={styles.editButton}>
              <MaterialIcons name="edit" size={16} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>Elena Solstice</Text>
          <Text style={styles.email}>elena.solstice@canvas.art</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as Href)}
              activeOpacity={0.7}
            >
              <View style={[styles.menuIcon, { backgroundColor: `${item.color}10` }]}>
                <MaterialIcons name={item.icon as any} size={24} color={item.color} />
              </View>
              <View style={styles.menuTextContainer}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuSubtitle}>
                  {item.title === 'Account Settings' ? 'Personal information, display name, and your creative bio' :
                   item.title === 'Notification Preferences' ? 'Choose how you receive updates about your gallery' :
                   'Manage your account security and privacy settings'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={20} color={`${Colors.onSurface}40`} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.signOutButton} onPress={handleLogout} activeOpacity={0.7}>
            <MaterialIcons name="logout" size={20} color={Colors.error} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.version}>SoulCanvas v2.4.0 • 2024</Text>
        </View>
      </ScrollView>

      <BottomNav activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  profileHeader: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: Colors.surfaceContainerHighest,
    overflow: 'hidden',
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: { width: '100%', height: '100%' },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  name: { fontSize: 24, fontWeight: '300', color: Colors.onSurface, marginBottom: 4 },
  email: { fontSize: 14, color: Colors.onSurfaceVariant },
  menuContainer: { width: '100%', gap: 16, marginBottom: 32 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.surfaceContainerLow}80`,
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  menuIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  menuTextContainer: { flex: 1, gap: 4 },
  menuTitle: { fontSize: 16, fontWeight: '500', color: Colors.onSurface },
  menuSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant, opacity: 0.7 },
  signOutContainer: { alignItems: 'center', width: '100%', gap: 16, marginBottom: 20 },
  divider: { width: '100%', height: 1, backgroundColor: `${Colors.outline}20` },
  signOutButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12 },
  signOutText: { fontSize: 14, fontWeight: '500', color: Colors.error },
  version: { fontSize: 10, color: `${Colors.onSurfaceVariant}40`, letterSpacing: 1 },
});
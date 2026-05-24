import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { supabase } from '../../services/supabase';

export default function PrivacyScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const handleChangePassword = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return Alert.alert('Error', 'No user found');
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    Alert.alert(error ? 'Error' : 'Email sent', error?.message || 'Check your email to reset password.');
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'This action is permanent. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          const { error } = await supabase.rpc('delete_user');
          if (error) Alert.alert('Error', error.message);
          else await supabase.auth.signOut();
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 20, paddingBottom: bottomNavHeight + 24 }]}>
        <View style={styles.headerSection}>
          <Text style={styles.badge}>Security Center</Text>
          <Text style={styles.title}>Privacy & Security</Text>
          <Text style={styles.subtitle}>Control your data and account protection.</Text>
        </View>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={handleChangePassword}>
            <View style={styles.menuIcon}><MaterialIcons name="lock-outline" size={24} color={Colors.primary} /></View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>Change Password</Text>
              <Text style={styles.menuSubtitle}>Receive a reset link to your email</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={`${Colors.onSurface}40`} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem} onPress={handleDeleteAccount}>
            <View style={[styles.menuIcon, { backgroundColor: `${Colors.error}15` }]}><MaterialIcons name="delete-outline" size={24} color={Colors.error} /></View>
            <View style={styles.menuTextContainer}>
              <Text style={[styles.menuTitle, { color: Colors.error }]}>Delete Account</Text>
              <Text style={styles.menuSubtitle}>Permanently erase all your data</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={`${Colors.onSurface}40`} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav activeTab="profile" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  headerSection: { width: '100%', marginBottom: 32 },
  badge: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.secondary, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '300', color: Colors.onSurface, lineHeight: 44, marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: '300', color: Colors.onSurfaceVariant, lineHeight: 22 },
  menuContainer: { width: '100%', gap: 16, marginBottom: 32 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${Colors.surfaceContainerLow}80`, borderRadius: 20, padding: 16, gap: 16 },
  menuIcon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: `${Colors.primary}10` },
  menuTextContainer: { flex: 1, gap: 4 },
  menuTitle: { fontSize: 16, fontWeight: '500', color: Colors.onSurface },
  menuSubtitle: { fontSize: 12, color: Colors.onSurfaceVariant, opacity: 0.7 },
});
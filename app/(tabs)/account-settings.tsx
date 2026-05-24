import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router'; // <-- tambah
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabase';

// Definisikan PROFILE_IMAGE (sama seperti di file lain)
const PROFILE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAPE9JLuQgeD-AYQxDJhk4N5CrudhlCBf3GB4SvB6ktMa9azXpssC2jN4AP3hb_m8wPqedwnj0Rp6pCILLW_0M8JYKZY5l3k1OOgZiF9QagAbKFWRNkc6sXY044EfsVBoTSFuGr5w5S0qJ8nTJ3duLo9svsQoP31TBX5f13fYUcsilzyTwkADvDfHA6EQmxZ7kgVfUw1f__rWKveHogHaoo7gyXVZHhN-2kWrJ6jkY77ppb_6Ahp-bR4U79-YaMSrPTMd8ytqImd2a_';

export default function AccountSettingsScreen() {
  const router = useRouter(); // <-- tambah
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);
  const { session } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(PROFILE_IMAGE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFullName(session.user.user_metadata?.full_name || '');
      setEmail(session.user.email || '');
      setAvatarUrl(session.user.user_metadata?.avatar_url || PROFILE_IMAGE);
    }
  }, [session]);

  const handleSave = async () => {
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName, avatar_url: avatarUrl }
    });
    setLoading(false);
    if (error) Alert.alert('Error', error.message);
    else Alert.alert('Success', 'Account settings saved!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            const { error } = await supabase.rpc('delete_user');
            if (error) Alert.alert('Error', error.message);
            else {
              await supabase.auth.signOut();
              router.replace('/(tabs)/login');
            }
          }
        }
      ]
    );
  };

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
        {/* Profile Image */}
        <View style={styles.profileImageContainer}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            <TouchableOpacity style={styles.editPhotoButton}>
              <MaterialIcons name="edit" size={18} color={Colors.onPrimary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{fullName || 'Art Lover'}</Text>
          <Text style={styles.userTier}>Free Tier Artist</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholderTextColor={`${Colors.outline}66`}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={`${Colors.outline}66`}
                editable={false} // email tidak bisa diubah
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, styles.passwordWrapper]}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!passwordVisible}
                placeholderTextColor={`${Colors.outline}66`}
                placeholder="New password (optional)"
              />
              <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                <MaterialIcons name={passwordVisible ? 'visibility-off' : 'visibility'} size={20} color={`${Colors.primary}80`} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.securitySection}>
          <View style={styles.securityHeader}>
            <MaterialIcons name="security" size={24} color={Colors.secondary} />
            <Text style={styles.securityTitle}>Account Security</Text>
          </View>
          <Text style={styles.securityDescription}>
            SoulCanvas respects your creative sovereignty. If you choose to delete your account, 
            all personal data, gallery archives, and reflective logs will be permanently removed 
            from our gallery vaults within 30 days. This action cannot be reversed.
          </Text>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount} activeOpacity={0.7}>
            <MaterialIcons name="delete-forever" size={18} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  profileImageContainer: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, borderWidth: 2, borderColor: Colors.surfaceContainerHighest },
  editPhotoButton: {
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
  userName: { fontSize: 20, fontWeight: '300', color: Colors.onSurface, marginBottom: 4 },
  userTier: { fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: `${Colors.onSurfaceVariant}99` },
  form: { width: '100%', gap: 20, marginBottom: 32 },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  inputWrapper: { backgroundColor: `${Colors.surfaceContainerLow}80`, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12 },
  passwordWrapper: { flexDirection: 'row', alignItems: 'center' },
  input: { fontSize: 16, fontWeight: '300', color: Colors.onSurface, padding: 0 },
  saveButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 40, alignItems: 'center', marginTop: 8 },
  saveButtonText: { fontSize: 14, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.onPrimary },
  securitySection: { backgroundColor: Colors.surfaceContainerLow, borderRadius: 20, padding: 20, gap: 12, marginBottom: 20 },
  securityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  securityTitle: { fontSize: 16, fontWeight: '500', color: Colors.onSurface },
  securityDescription: { fontSize: 13, color: Colors.onSurfaceVariant, lineHeight: 18 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12, borderWidth: 1, borderColor: `${Colors.error}30`, borderRadius: 40, marginTop: 8 },
  deleteButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.error },
});
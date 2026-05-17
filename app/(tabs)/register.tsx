import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Href } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setIsDisabled(!fullName.trim() || !email.trim() || !password.trim() || !confirmPassword.trim());
  }, [fullName, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Password dan konfirmasi password tidak cocok.');
      return;
    }
    if (password.length < 8) {
      Alert.alert('Error', 'Password harus minimal 8 karakter.');
      return;
    }

    setLoading(true);
    
    // Simulasi proses register
    setTimeout(async () => {
      // Simpan status login setelah register berhasil
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userEmail', email);
      await AsyncStorage.setItem('userName', fullName);
      
      setLoading(false);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)' as Href) }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.iconWrapper}>
              <MaterialIcons name="auto-awesome" size={40} color={Colors.primary} />
            </View>
            <Text style={styles.brandSubtitle}>SoulCanvas</Text>
            <Text style={styles.title}>Begin your{'\n'}creative journey</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  placeholderTextColor={`${Colors.outline}66`}
                  value={fullName}
                  onChangeText={setFullName}
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="you@canvas.art"
                  placeholderTextColor={`${Colors.outline}66`}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Secret Key</Text>
              <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={`${Colors.outline}66`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <MaterialIcons name={passwordVisible ? 'visibility-off' : 'visibility'} size={20} color={`${Colors.primary}80`} />
                </TouchableOpacity>
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Secret Key</Text>
              <View style={[styles.inputContainer, { flexDirection: 'row', alignItems: 'center' }]}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={`${Colors.outline}66`}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!confirmPasswordVisible}
                />
                <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
                  <MaterialIcons name={confirmPasswordVisible ? 'visibility-off' : 'visibility'} size={20} color={`${Colors.primary}80`} />
                </TouchableOpacity>
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity 
              style={[styles.registerButton, isDisabled && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isDisabled || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.registerButtonText}>Create Account</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.onPrimary} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => router.push('/(tabs)/login' as Href)}
              >
                Log in
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 24, paddingVertical: 20 },
  header: { marginBottom: 20 },
  backButton: { padding: 8, alignSelf: 'flex-start' },
  brandContainer: { alignItems: 'center', marginBottom: 40 },
  iconWrapper: { marginBottom: 16 },
  brandSubtitle: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.onSurfaceVariant, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '300', textAlign: 'center', color: Colors.onSurface, lineHeight: 42 },
  form: { gap: 20, marginBottom: 32 },
  inputGroup: { gap: 6 },
  label: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  inputContainer: { position: 'relative' },
  input: { fontSize: 16, fontWeight: '300', color: Colors.onSurface, paddingVertical: 12, paddingHorizontal: 4 },
  inputUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: `${Colors.outline}40` },
  registerButton: { 
    flexDirection: 'row', 
    backgroundColor: Colors.primary, 
    paddingVertical: 18, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8,
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  registerButtonDisabled: { opacity: 0.6 },
  registerButtonText: { fontSize: 14, fontWeight: '500', letterSpacing: 1, color: Colors.onPrimary },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 14, color: Colors.onSurfaceVariant },
  loginLink: { color: Colors.secondary, fontWeight: '500', textDecorationLine: 'underline' },
});
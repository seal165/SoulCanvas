import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, Href } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { supabase } from '../../services/supabase';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) Alert.alert('Login Failed', error.message);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Header dengan back button */}
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
            <Text style={styles.title}>Welcome back to{'\n'}your sanctuary</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="artist@soulcanvas.com"
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
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity>
                  <Text style={styles.forgotLink}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor={`${Colors.outline}66`}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                  <MaterialIcons 
                    name={passwordVisible ? 'visibility-off' : 'visibility'} 
                    size={20} 
                    color={`${Colors.primary}80`} 
                  />
                </TouchableOpacity>
                <View style={styles.inputUnderline} />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity 
              style={[styles.loginButton, (!email || !password) && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={!email || !password || loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color={Colors.onPrimary} />
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Enter Sanctuary</Text>
                  <MaterialIcons name="arrow-forward" size={18} color={Colors.onPrimary} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              New to the collection?{' '}
              <Text 
                style={styles.signupLink}
                onPress={() => router.push('/(tabs)/register' as Href)}
              >
                Create an account
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
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { marginBottom: 20 },
  backButton: { padding: 8, alignSelf: 'flex-start' },
  brandContainer: { alignItems: 'center', marginBottom: 48 },
  iconWrapper: { marginBottom: 16 },
  brandSubtitle: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.onSurfaceVariant, marginBottom: 12 },
  title: { fontSize: 32, fontWeight: '300', textAlign: 'center', color: Colors.onSurface, lineHeight: 42 },
  form: { gap: 24, marginBottom: 32 },
  inputGroup: { gap: 8 },
  label: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  passwordHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  forgotLink: { fontSize: 10, fontWeight: '500', letterSpacing: 0.5, textTransform: 'uppercase', color: Colors.secondary },
  inputContainer: { position: 'relative', flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, fontSize: 16, fontWeight: '300', color: Colors.onSurface, paddingVertical: 12, paddingHorizontal: 4 },
  inputUnderline: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: `${Colors.outline}40` },
  loginButton: { 
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
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { fontSize: 14, fontWeight: '500', letterSpacing: 1, color: Colors.onPrimary },
  footer: { alignItems: 'center' },
  footerText: { fontSize: 14, color: Colors.onSurfaceVariant },
  signupLink: { color: Colors.secondary, fontWeight: '500', textDecorationLine: 'underline' },
});
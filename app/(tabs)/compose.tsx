import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function ComposeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [feeling, setFeeling] = useState('');

  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 32,
            paddingBottom: bottomNavHeight + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.bgBlurRight, { width: width * 0.5, height: width * 0.5, borderRadius: width * 0.25, right: -width * 0.2, top: -width * 0.2 }]} />
        <View style={[styles.bgBlurLeft, { width: width * 0.4, height: width * 0.4, borderRadius: width * 0.2, left: -width * 0.2, bottom: -width * 0.1 }]} />

        <View style={styles.headerSection}>
          <Text style={styles.title}>Compose your feeling</Text>
          <Text style={styles.subtitle}>Translate your inner landscape into a visual sanctuary.</Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textArea}
              placeholder="How do you feel today?"
              placeholderTextColor={Colors.outline + '66'}
              multiline
              value={feeling}
              onChangeText={setFeeling}
              textAlignVertical="top"
            />
            <View style={styles.toolsRow}>
              <View style={styles.voiceGroup}>
                <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
                  <MaterialIcons name="mic" size={24} color={Colors.secondary} />
                </TouchableOpacity>
                <Text style={styles.voiceText}>Voice Composition</Text>
              </View>
              <View style={styles.tagsGroup}>
                <Text style={styles.tag}>Reflective</Text>
                <Text style={styles.tag}>Deep</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.generateButton} activeOpacity={0.8} onPress={() => router.push('/(tabs)/gallery')}>
            <Text style={styles.generateButtonText}>Generate Art</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quoteText}>Art washes away from the soul the dust of everyday life.</Text>
        </View>
      </ScrollView>

      <BottomNav activeTab="compose" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  bgBlurRight: { position: 'absolute', backgroundColor: Colors.secondaryFixedDim + '1A', opacity: 0.5 },
  bgBlurLeft: { position: 'absolute', backgroundColor: Colors.primaryFixedDim + '1A', opacity: 0.5 },
  headerSection: { alignItems: 'center', marginBottom: 64, marginTop: 20 },
  title: { fontSize: 40, fontWeight: '300', letterSpacing: -0.8, textAlign: 'center', color: Colors.onSurface, marginBottom: 16 },
  subtitle: { fontSize: 18, fontWeight: '400', textAlign: 'center', color: Colors.onSurfaceVariant, maxWidth: 320, lineHeight: 24 },
  inputSection: { width: '100%', marginBottom: 48 },
  inputCard: { backgroundColor: Colors.surfaceContainerLowest, padding: 32, borderRadius: 12, shadowColor: '#1c1c17', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 },
  textArea: { minHeight: 200, fontSize: 24, fontWeight: '300', color: Colors.onSurface, padding: 0 },
  toolsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 16, flexWrap: 'wrap', gap: 16 },
  voiceGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  micButton: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.secondaryContainer + '33' },
  voiceText: { fontSize: 10, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.onSurfaceVariant + '99' },
  tagsGroup: { flexDirection: 'row', gap: 8 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 6, fontSize: 10, fontWeight: '500', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  actionSection: { alignItems: 'center', gap: 24, width: '100%', marginBottom: 64 },
  generateButton: { width: '100%', maxWidth: 280, paddingVertical: 16, backgroundColor: Colors.primary, borderRadius: 999, alignItems: 'center' },
  generateButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.onPrimary },
  backButton: { paddingVertical: 8 },
  backButtonText: { fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: Colors.secondary },
  footer: { alignItems: 'center', marginBottom: 40 },
  quoteMark: { fontSize: 48, color: Colors.secondaryFixedDim, opacity: 0.4, marginBottom: 8, lineHeight: 48 },
  quoteText: { fontSize: 14, fontStyle: 'italic', fontWeight: '300', textAlign: 'center', color: Colors.onSurfaceVariant + 'CC', maxWidth: 280, lineHeight: 20 },
});
import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const CAPSULE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc9mOfUuvqXT85BmzWYwEr5F-McJts-vQx_pP89HjI4Ibb9b77HxwhI47-CBp9KGj9ncMTRvC51_SSm_GENG52ja5EGexeFOnfZ9B_lrcpxP9QSkmmITMymEdNgB3CGLR2BbY0ZMsb0gTZpnnx2X3yaqYDWpZAliyqyaIKAThE80OTqByBWlu4fK_JhfhgXXicmI2k2C9yELrlbUxVljD8lDoaoYxMLYEaH9YUvI7KazXplXAZ-j9HIQnGrLRkc7hcrvDbOfMtpxOe';

export default function CapsuleScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const quickSelectDates = ['6 Months', '1 Year', '5 Years'];

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
        <View style={[styles.bgBlur1, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, right: -width * 0.2, top: width * 0.25 }]} />
        <View style={[styles.bgBlur2, { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, left: -width * 0.2, bottom: width * 0.25 }]} />

        <View style={styles.heroSection}>
          <Text style={styles.heroBadge}>Reflection Portal</Text>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>A Letter to Future You.</Text>
            <Text style={styles.heroQuote}>
              &quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;
            </Text>
          </View>
        </View>

        <View style={styles.editorGrid}>
          <View style={[styles.textAreaContainer]}>
            <Text style={styles.inputLabel}>Your Message</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Speak to the person you are becoming..."
              placeholderTextColor={Colors.outline + '66'}
              multiline
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />
            <View style={styles.inputFooter}>
              <MaterialIcons name="edit-note" size={20} color={Colors.onSurfaceVariant + '66'} />
              <Text style={styles.inputFooterText}>Thought Flowing...</Text>
            </View>
          </View>

          <View style={styles.sidebar}>
            <View style={[styles.dateCard]}>
              <Text style={styles.dateLabel}>Seal Until</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.outline + '66'}
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                />
                <MaterialIcons name="calendar-today" size={24} color={Colors.secondaryFixedDim} />
              </View>
              <View style={styles.quickSelect}>
                <Text style={styles.quickSelectLabel}>Quick Select</Text>
                <View style={styles.quickSelectButtons}>
                  {quickSelectDates.map((label, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.quickSelectButton, label === '5 Years' && styles.quickSelectButtonActive]}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.quickSelectButtonText, label === '5 Years' && styles.quickSelectButtonTextActive]}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.imageCard}>
              <Image source={{ uri: CAPSULE_IMAGE }} style={styles.capsuleImage} resizeMode="cover" />
              <View style={styles.imageOverlay} />
              <View style={styles.imageCaption}>
                <Text style={styles.imageCaptionText}>Your words will remain encrypted and silent until the chosen horizon.</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Capsule</Text>
            <MaterialIcons name="arrow-forward" size={18} color={Colors.onPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} activeOpacity={0.7}>
            <MaterialIcons name="visibility" size={18} color={Colors.secondary} />
            <Text style={styles.viewButtonText}>View Capsules</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recently Sealed</Text>
          <View style={styles.recentGrid}>
            <TouchableOpacity style={styles.recentCard} activeOpacity={0.7}>
              <View style={styles.recentCardHeader}>
                <MaterialIcons name="lock" size={20} color={Colors.secondaryFixedDim} />
                <Text style={styles.recentCardDate}>Arriving Oct 2025</Text>
              </View>
              <Text style={styles.recentCardText}>Dreams of the coast...</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentCard} activeOpacity={0.7}>
              <View style={styles.recentCardHeader}>
                <MaterialIcons name="lock" size={20} color={Colors.secondaryFixedDim} />
                <Text style={styles.recentCardDate}>Arriving Jan 2030</Text>
              </View>
              <Text style={styles.recentCardText}>To the older, wiser me.</Text>
            </TouchableOpacity>
            <View style={styles.emptyCard}>
              <Text style={styles.emptyCardText}>Empty Slot</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav activeTab="capsule" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { paddingHorizontal: 24 },
  bgBlur1: { position: 'absolute', backgroundColor: Colors.tertiaryContainer + '33' },
  bgBlur2: { position: 'absolute', backgroundColor: Colors.primaryContainer + '1A' },
  heroSection: { marginBottom: 40, marginTop: 20 },
  heroBadge: { fontSize: 11, fontWeight: '500', letterSpacing: 1.1, textTransform: 'uppercase', color: Colors.secondary, marginBottom: 16 },
  heroHeader: { gap: 16 },
  heroTitle: { fontSize: 36, fontWeight: '300', letterSpacing: -0.72, color: Colors.onSurface },
  heroQuote: { fontSize: 14, fontStyle: 'italic', color: Colors.onSurfaceVariant, maxWidth: 280, lineHeight: 20 },
  editorGrid: { gap: 24, marginBottom: 32 },
  textAreaContainer: { backgroundColor: Colors.surfaceContainerLowest, padding: 32, borderRadius: 12, shadowColor: '#1c1c17', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 },
  inputLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.secondary, marginBottom: 16 },
  textInput: { minHeight: 200, fontSize: 18, fontWeight: '300', color: Colors.onSurface, padding: 0 },
  inputFooter: { flexDirection: 'row', alignItems: 'center', gap: 16, marginTop: 24 },
  inputFooterText: { fontSize: 10, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.onSurfaceVariant + '66' },
  sidebar: { gap: 32 },
  dateCard: { backgroundColor: Colors.surfaceContainerLow, padding: 24, borderRadius: 12, gap: 24 },
  dateLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.secondary },
  dateInputWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + '66', paddingBottom: 4 },
  dateInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: Colors.onSurface },
  quickSelect: { gap: 12 },
  quickSelectLabel: { fontSize: 11, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  quickSelectButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  quickSelectButton: { paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 6 },
  quickSelectButtonActive: { backgroundColor: Colors.secondaryContainer + '66' },
  quickSelectButtonText: { fontSize: 12, fontWeight: '500', color: Colors.onSurfaceVariant },
  quickSelectButtonTextActive: { color: Colors.onSecondaryContainer },
  imageCard: { aspectRatio: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  capsuleImage: { width: '100%', height: '100%', opacity: 0.9 },
  imageOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: Colors.primary + '66' },
  imageCaption: { position: 'absolute', bottom: 16, left: 16, right: 16 },
  imageCaptionText: { color: '#ffffff', fontSize: 11, fontWeight: '300', lineHeight: 16 },
  actionButtons: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 32, marginBottom: 48, marginTop: 16 },
  saveButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 40, paddingVertical: 16, backgroundColor: Colors.primary, borderRadius: 999 },
  saveButtonText: { fontSize: 12, fontWeight: '600', letterSpacing: 1.8, textTransform: 'uppercase', color: Colors.onPrimary },
  viewButton: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8 },
  viewButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 1.8, textTransform: 'uppercase', color: Colors.secondary },
  recentSection: { paddingTop: 48, borderTopWidth: 1, borderTopColor: Colors.outlineVariant + '1A', marginBottom: 40 },
  recentTitle: { fontSize: 11, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: Colors.onSurfaceVariant, marginBottom: 32 },
  recentGrid: { gap: 24 },
  recentCard: { padding: 20, backgroundColor: Colors.surfaceContainerLow, borderRadius: 12, gap: 16 },
  recentCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentCardDate: { fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.onSurfaceVariant + '99' },
  recentCardText: { fontSize: 14, fontWeight: '500', color: Colors.onSurface },
  emptyCard: { padding: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.outlineVariant + '66', borderRadius: 12, alignItems: 'center' },
  emptyCardText: { fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.onSurfaceVariant + '66' },
});
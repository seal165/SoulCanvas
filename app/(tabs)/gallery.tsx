import React from 'react';
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const GALLERY_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9IL5ei8UZF9Vs-Kq_m0vJ9LpyjYyutbytUnaRhbNWhMXvu-CNrtpA52DLP32ftx9W57nwIqRGH8bg7joKtSgBhO3HHiRUziQV2xGe5TdNVXMyDgIks412H7h_XIq-IaN1DTOPw4jq9XXiFCWqHZX3Fj1CWf_GXix6ajC_tVhtr49M3JnJ8HpoINPEUePWPkGdZdxeQPrUQU4hVNGZ6jZJnF7gwMp7MF2V79fEtPBOMeTELWTyUb-KZLJZJcp9LmXEB8MRtNE59s9i';

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
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
        <View style={[styles.bgBlur1, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, right: -width * 0.2, top: width * 0.25 }]} />
        <View style={[styles.bgBlur2, { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, left: -width * 0.2, bottom: width * 0.25 }]} />

        <View style={styles.resultHeader}>
          <View style={styles.resultHeaderLeft}>
            <Text style={styles.resultBadge}>Manifestation Complete</Text>
            <Text style={styles.resultTitle}>The Echo of {'\n'}Your Inner Silence</Text>
          </View>
          <View style={styles.resultHeaderRight}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <MaterialIcons name="share" size={20} color={Colors.secondary} />
              <Text style={styles.iconButtonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <MaterialIcons name="refresh" size={20} color={Colors.onSurfaceVariant} />
              <Text style={[styles.iconButtonText, { color: Colors.onSurfaceVariant }]}>Regenerate</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.artworkSection}>
          <View style={styles.artworkWrapper}>
            <View style={styles.artworkInner}>
              <Image source={{ uri: GALLERY_IMAGE }} style={styles.artworkImage} resizeMode="cover" />
              <View style={styles.artworkOverlay} />
            </View>
            <View style={styles.artworkCaption}>
              <Text style={styles.artworkEdition}>SoulCanvas Edition 001</Text>
              <Text style={styles.artworkQuote}>&quot;A journey through the subconscious&quot;</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionGrid}>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Artwork</Text>
          </TouchableOpacity>
          <View style={styles.actionIcons}>
            <TouchableOpacity style={styles.actionIconGroup} activeOpacity={0.7}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="download" size={20} color={Colors.onSurfaceVariant} />
              </View>
              <Text style={styles.actionIconText}>Hi-Res Export</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionIconGroup} activeOpacity={0.7}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="brush" size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.actionIconText}>Apply Style</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.backHomeButton} activeOpacity={0.7} onPress={() => router.push('/(tabs)')}>
            <Text style={styles.backHomeText}>Back to Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Tonal Balance</Text>
            <Text style={styles.detailText}>The palette leverages organic earth foundations (#FDF9F1) contrasted by intellectual navy tones (#535F6F).</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Geometric Soul</Text>
            <Text style={styles.detailText}>Asymmetric distribution of visual weight creates a breathing composition that evolves with every glance.</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailTitle}>Materiality</Text>
            <Text style={styles.detailText}>Rendered using 2048-bit neural pathways to ensure every gold accent reflects the warmth of your intent.</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav activeTab="gallery" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  bgBlur1: { position: 'absolute', backgroundColor: Colors.tertiaryContainer + '33' },
  bgBlur2: { position: 'absolute', backgroundColor: Colors.primaryContainer + '1A' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, marginTop: 20, flexWrap: 'wrap', gap: 24 },
  resultHeaderLeft: { flex: 1, gap: 16 },
  resultBadge: { fontSize: 11, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.secondary },
  resultTitle: { fontSize: 40, fontWeight: '300', letterSpacing: -0.8, color: Colors.onSurface, lineHeight: 48 },
  resultHeaderRight: { flexDirection: 'row', gap: 24 },
  iconButton: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButtonText: { fontSize: 10, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.secondary },
  artworkSection: { width: '100%', marginBottom: 48 },
  artworkWrapper: { position: 'relative', width: '100%', maxWidth: 896, aspectRatio: 16 / 10, backgroundColor: Colors.surfaceContainerLowest, borderRadius: 12, padding: 32, shadowColor: '#1c1c17', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 },
  artworkInner: { width: '100%', height: '100%', borderRadius: 8, overflow: 'hidden', backgroundColor: Colors.surfaceContainer },
  artworkImage: { width: '100%', height: '100%', opacity: 0.8 },
  artworkOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(83, 95, 111, 0.1)' },
  artworkCaption: { position: 'absolute', bottom: 48, right: 48, backgroundColor: Colors.surfaceContainerLowest + 'CC', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 8, borderWidth: 1, borderColor: Colors.outlineVariant + '1A' },
  artworkEdition: { fontSize: 10, fontWeight: '500', letterSpacing: 2, textTransform: 'uppercase', color: Colors.secondary, marginBottom: 4 },
  artworkQuote: { fontSize: 14, fontWeight: '300', fontStyle: 'italic', color: Colors.onSurface },
  actionGrid: { width: '100%', maxWidth: 896, alignItems: 'center', gap: 32, marginBottom: 64 },
  saveButton: { width: '100%', maxWidth: 280, paddingVertical: 20, backgroundColor: Colors.primary, borderRadius: 999, alignItems: 'center' },
  saveButtonText: { fontSize: 12, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', color: Colors.onPrimary },
  actionIcons: { flexDirection: 'row', gap: 32, alignItems: 'center' },
  actionIconGroup: { alignItems: 'center', gap: 12 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surfaceContainerHigh, alignItems: 'center', justifyContent: 'center' },
  actionIconText: { fontSize: 10, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  backHomeButton: { paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: Colors.secondary + '33' },
  backHomeText: { fontSize: 10, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.secondary },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 48, marginBottom: 40, justifyContent: 'center' },
  detailCard: { flex: 1, minWidth: 200, gap: 16 },
  detailTitle: { fontSize: 13, fontWeight: '500', letterSpacing: 1.6, textTransform: 'uppercase', color: Colors.onSurfaceVariant },
  detailText: { fontSize: 13, fontWeight: '300', lineHeight: 20, color: Colors.onSurfaceVariant + 'B3' },
});
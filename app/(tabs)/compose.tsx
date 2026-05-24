import { BottomNav, Header } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../../services/api';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

// Fungsi generate abstract emotional art berdasarkan feeling user
const generateAbstractArt = async (feeling: string): Promise<string> => {
  const lowerFeeling = feeling.toLowerCase();

  let auraColor = "";
  let emotionShape = "";

  // ===== WARNA & BENTUK ABSTRAK BERDASARKAN FEELING =====
  if (
    lowerFeeling.includes("happy") ||
    lowerFeeling.includes("excited") ||
    lowerFeeling.includes("semangat") ||
    lowerFeeling.includes("hope") ||
    lowerFeeling.includes("senang")
  ) {
    auraColor = "pastel orange, warm sunlight, glowing golden light leaks, creamy white";
    emotionShape = "blooming soft floral shapes, bright ethereal glow, airy composition";
  }
  else if (
    lowerFeeling.includes("sad") ||
    lowerFeeling.includes("lonely") ||
    lowerFeeling.includes("empty") ||
    lowerFeeling.includes("kecewa") ||
    lowerFeeling.includes("sedih")
  ) {
    auraColor = "muted indigo, cold pale blue, dusty grey, faded shadowy vignette";
    emotionShape = "isolated drooping soft petal silhouette, heavy misty blur, melancholic empty space";
  }
  else if (
    lowerFeeling.includes("love") ||
    lowerFeeling.includes("romantic") ||
    lowerFeeling.includes("sayang") ||
    lowerFeeling.includes("cinta")
  ) {
    auraColor = "blush pink, soft magenta, warm peach, gentle glowing flares";
    emotionShape = "overlapping soft floral silhouettes, intimate dreamy blur";
  }
  else if (
    lowerFeeling.includes("angry") ||
    lowerFeeling.includes("frustrated") ||
    lowerFeeling.includes("stress") ||
    lowerFeeling.includes("marah")
  ) {
    auraColor = "deep crimson, dark amber, intense burnt orange, high contrast shadows";
    emotionShape = "intense glowing abstract botanical shapes, dramatic heavy grain, chaotic light leaks";
  }
  else if (
    lowerFeeling.includes("calm") ||
    lowerFeeling.includes("peace") ||
    lowerFeeling.includes("tenang")
  ) {
    auraColor = "sage green, soft pale teal, misty white, gentle atmospheric light";
    emotionShape = "smooth floating petal shapes, balanced serene blur, quiet mist";
  }
  else {
    auraColor = "muted vintage tones, soft creamy white, subtle warm light leaks";
    emotionShape = "gentle out of focus botanical blur, mysterious glowing silhouettes";
  }

  const prompt = `ethereal out of focus photography representing "${feeling}", ${emotionShape}, ${auraColor}, vintage film grain texture, light leaks, dreamy double exposure effect, glowing blurred botanical silhouettes, soft pastel polaroid aesthetic, macro photography blur, visually poetic, no sharp edges, no humans, no mosaic, no clear objects, no typography`;

  const formattedPrompt = encodeURIComponent(prompt.trim().replace(/\s+/g, ' '));
  return `https://image.pollinations.ai/prompt/${formattedPrompt}?width=1920&height=1920&model=flux&enhance=true&nologo=true&seed=${Date.now()}`;
};

const getInspirationalCaption = (feeling: string): string => {
  const f = feeling.toLowerCase();
  if (f.includes('happy') || f.includes('joy') || f.includes('senang')) return "A soft, warm glow radiates from your being.";
  if (f.includes('sad') || f.includes('melancholy') || f.includes('sedih')) return "Quiet shadows dance in gentle stillness.";
  if (f.includes('love') || f.includes('cinta') || f.includes('sayang')) return "Two hearts merge into one beautiful form.";
  if (f.includes('calm') || f.includes('peace') || f.includes('tenang')) return "Serenity flows like a gentle river.";
  if (f.includes('excited') || f.includes('semangat')) return "Bold energy bursts with vibrant possibility.";
  if (f.includes('anxious') || f.includes('cemas') || f.includes('stress')) return "Waves of emotion finding their rhythm.";
  if (f.includes('hopeful') || f.includes('harapan')) return "A single light pierces through the darkness.";
  if (f.includes('lonely') || f.includes('kesepian')) return "One soul learning to dance alone.";
  return "Your emotion speaks in colors and light.";
};

export default function ComposeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [feeling, setFeeling] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceNoteUri, setVoiceNoteUri] = useState<string | null>(null);

  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const startRecording = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) {
        Alert.alert('Permission needed', 'Please allow microphone access');
        return;
      }
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    setVoiceNoteUri(recording.getURI());
    setRecording(null);
    Alert.alert('Voice Note Saved', 'Your voice note has been recorded.');
  };

  const handleGenerateArt = async () => {
    if (!feeling.trim()) {
      Alert.alert('Empty', 'Please write how you feel today');
      return;
    }

    setGenerating(true);

    try {
      const imageUrl = await generateAbstractArt(feeling);
      const caption = getInspirationalCaption(feeling);
      
      // Ambil user ID dari session
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Error', 'You must be logged in');
        setGenerating(false);
        return;
      }

      const { error } = await api.from('artworks').insert({
        user_id: user.id,
        feeling: feeling.trim(),
        image_url: imageUrl,
        caption: caption,
        voice_note_uri: voiceNoteUri || null,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Artwork Created', `"${caption}"`, [
        { text: 'View in Gallery', onPress: () => router.push('/(tabs)/gallery') },
        { text: 'Create Another', style: 'cancel' }
      ]);
      
      setFeeling('');
      setVoiceNoteUri(null);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to generate artwork. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

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
          <Text style={styles.title}>Express your feeling</Text>
          <Text style={styles.subtitle}>Write or speak what{"'"}s in your heart, and see its abstract form.</Text>
        </View>

        <View style={styles.inputSection}>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.textArea}
              placeholder="How do you feel today? Just write what comes..."
              placeholderTextColor={Colors.outline + '66'}
              multiline
              value={feeling}
              onChangeText={setFeeling}
              textAlignVertical="top"
            />
            <View style={styles.toolsRow}>
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.micButtonActive]} 
                activeOpacity={0.7}
                onPress={isRecording ? stopRecording : startRecording}
              >
                <MaterialIcons name={isRecording ? "stop" : "mic"} size={24} color={Colors.secondary} />
                <Text style={styles.voiceText}>
                  {isRecording ? 'Stop Recording' : voiceNoteUri ? 'Voice Note Saved ✓' : 'Voice Note'}
                </Text>
              </TouchableOpacity>
              
              <View style={styles.aiBadge}>
                <MaterialIcons name="auto-awesome" size={14} color={Colors.primary} />
                <Text style={styles.aiBadgeText}>HD Abstract Art</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity 
            style={[styles.generateButton, generating && styles.generateButtonDisabled]}
            activeOpacity={0.8}
            onPress={handleGenerateArt}
            disabled={generating}
          >
            {generating ? (
              <>
                <ActivityIndicator color={Colors.onPrimary} size="small" />
                <Text style={styles.generateButtonText}>Translating feeling to shape...</Text>
              </>
            ) : (
              <>
                <MaterialIcons name="brush" size={20} color={Colors.onPrimary} />
                <Text style={styles.generateButtonText}>See My Feeling</Text>
              </>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.quoteMark}>“</Text>
          <Text style={styles.quoteText}>Art washes away from the soul the dust of everyday life.</Text>
          <Text style={styles.quoteAuthor}>— Pablo Picasso</Text>
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
  headerSection: { alignItems: 'center', marginBottom: 48, marginTop: 20 },
  title: { fontSize: 36, fontWeight: '300', letterSpacing: -0.8, textAlign: 'center', color: Colors.onSurface, marginBottom: 16 },
  subtitle: { fontSize: 16, fontWeight: '400', textAlign: 'center', color: Colors.onSurfaceVariant, maxWidth: 320, lineHeight: 24 },
  inputSection: { width: '100%', marginBottom: 48 },
  inputCard: { backgroundColor: Colors.surfaceContainerLowest, padding: 28, borderRadius: 24, shadowColor: '#1c1c17', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 24, elevation: 2 },
  textArea: { minHeight: 180, fontSize: 20, fontWeight: '300', color: Colors.onSurface, padding: 0, lineHeight: 28 },
  toolsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, marginTop: 16, flexWrap: 'wrap', gap: 16 },
  micButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.secondaryContainer + '33', borderRadius: 30 },
  micButtonActive: { backgroundColor: Colors.secondaryContainer + '66' },
  voiceText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.secondary },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.primaryContainer + '20', borderRadius: 20 },
  aiBadgeText: { fontSize: 10, fontWeight: '500', letterSpacing: 0.8, color: Colors.primary },
  actionSection: { alignItems: 'center', gap: 24, width: '100%', marginBottom: 48 },
  generateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', maxWidth: 280, paddingVertical: 16, backgroundColor: Colors.primary, borderRadius: 40, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  generateButtonDisabled: { opacity: 0.7 },
  generateButtonText: { fontSize: 14, fontWeight: '500', letterSpacing: 1, color: Colors.onPrimary },
  backButton: { paddingVertical: 8 },
  backButtonText: { fontSize: 10, fontWeight: '500', letterSpacing: 2.2, textTransform: 'uppercase', color: Colors.secondary },
  footer: { alignItems: 'center', marginBottom: 20 },
  quoteMark: { fontSize: 48, color: Colors.secondaryFixedDim, opacity: 0.4, marginBottom: 8, lineHeight: 48 },
  quoteText: { fontSize: 14, fontStyle: 'italic', fontWeight: '300', textAlign: 'center', color: Colors.onSurfaceVariant + 'CC', maxWidth: 280, lineHeight: 20 },
  quoteAuthor: { fontSize: 11, fontWeight: '400', textAlign: 'center', color: Colors.onSurfaceVariant + '80', marginTop: 8 },
});
import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

const CAPSULE_IMAGE = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAc9mOfUuvqXT85BmzWYwEr5F-McJts-vQx_pP89HjI4Ibb9b77HxwhI47-CBp9KGj9ncMTRvC51_SSm_GENG52ja5EGexeFOnfZ9B_lrcpxP9QSkmmITMymEdNgB3CGLR2BbY0ZMsb0gTZpnnx2X3yaqYDWpZAliyqyaIKAThE80OTqByBWlu4fK_JhfhgXXicmI2k2C9yELrlbUxVljD8lDoaoYxMLYEaH9YUvI7KazXplXAZ-j9HIQnGrLRkc7hcrvDbOfMtpxOe';

interface Capsule {
  id: string;
  message: string;
  seal_date: string;
  created_at: string;
}

export default function CapsuleScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedCapsule, setSelectedCapsule] = useState<Capsule | null>(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [capsuleContent, setCapsuleContent] = useState('');

  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);
  const quickSelectDates = ['6 Months', '1 Year', '5 Years'];

  const fetchCapsules = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('capsules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCapsules(data || []);
    } catch (err) {
      console.error('Error fetching capsules:', err);
      Alert.alert('Error', 'Failed to load capsules');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCapsules();
  }, [fetchCapsules]);

  const isValidDate = (dateStr: string) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return date instanceof Date && !isNaN(date.getTime());
  };

  const quickSelectDate = (label: string) => {
    const today = new Date();
    let targetDate = new Date();
    if (label === '6 Months') targetDate.setMonth(today.getMonth() + 6);
    else if (label === '1 Year') targetDate.setFullYear(today.getFullYear() + 1);
    else if (label === '5 Years') targetDate.setFullYear(today.getFullYear() + 5);
    setSelectedDate(targetDate.toISOString().split('T')[0]);
  };

  const canOpenCapsule = (sealDate: string) => {
    const today = new Date();
    const seal = new Date(sealDate);
    return today >= seal;
  };

  const handleOpenCapsule = (capsule: Capsule) => {
    const canOpen = canOpenCapsule(capsule.seal_date);
    if (canOpen) {
      setCapsuleContent(capsule.message);
      setSelectedCapsule(capsule);
      setShowContentModal(true);
    } else {
      const sealDateObj = new Date(capsule.seal_date);
      Alert.alert('Capsule Locked', `This capsule is sealed until ${sealDateObj.toLocaleDateString()}. Return on this date to read your message.`, [{ text: 'OK' }]);
    }
  };

  const handleSaveCapsule = async () => {
    if (!message.trim()) {
      Alert.alert('Incomplete', 'Please write your message');
      return;
    }
    if (!selectedDate.trim()) {
      Alert.alert('Incomplete', 'Please select a seal date');
      return;
    }
    if (!isValidDate(selectedDate)) {
      Alert.alert('Invalid Date', 'Please use format: YYYY-MM-DD (example: 2025-12-31)');
      return;
    }

    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('capsules').insert({
        user_id: user?.id,
        message: message.trim(),
        seal_date: selectedDate,
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      Alert.alert('Success', 'Your time capsule is sealed!', [
        { text: 'OK', onPress: () => {
          setMessage('');
          setSelectedDate('');
          fetchCapsules();
        }}
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to save capsule');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCapsule = (id: string) => {
    Alert.alert('Delete Capsule', 'Are you sure? This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('capsules').delete().eq('id', id);
          if (error) Alert.alert('Error', 'Failed to delete');
          else fetchCapsules();
        }
      }
    ]);
  };

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getCapsuleStatus = (sealDate: string) => {
    const canOpen = canOpenCapsule(sealDate);
    return {
      icon: canOpen ? 'lock-open' : 'lock',
      text: canOpen ? 'Ready to open' : 'Locked',
      color: canOpen ? Colors.secondary : Colors.onSurfaceVariant
    };
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: headerHeight + 32, paddingBottom: bottomNavHeight + 24 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.bgBlur1, { width: width * 0.8, height: width * 0.8, borderRadius: width * 0.4, right: -width * 0.2, top: width * 0.25 }]} />
        <View style={[styles.bgBlur2, { width: width * 0.9, height: width * 0.9, borderRadius: width * 0.45, left: -width * 0.2, bottom: width * 0.25 }]} />
        <View style={styles.heroSection}>
          <Text style={styles.heroBadge}>Reflection Portal</Text>
          <View style={styles.heroHeader}>
            <Text style={styles.heroTitle}>A Letter to Future You.</Text>
            <Text style={styles.heroQuote}>&quot;The best time to plant a tree was 20 years ago. The second best time is now.&quot;</Text>
          </View>
        </View>
        <View style={styles.editorGrid}>
          <View style={[styles.textAreaContainer]}>
            <Text style={styles.inputLabel}>Your Message (Hidden until seal date)</Text>
            <TextInput style={styles.textInput} placeholder="Write something only your future self can read..." placeholderTextColor={Colors.outline + '66'} multiline value={message} onChangeText={setMessage} textAlignVertical="top" />
            <View style={styles.inputFooter}><MaterialIcons name="lock" size={16} color={Colors.secondaryFixedDim} /><Text style={styles.inputFooterText}>This message will be encrypted</Text></View>
          </View>
          <View style={styles.sidebar}>
            <View style={[styles.dateCard]}>
              <Text style={styles.dateLabel}>Seal Until (YYYY-MM-DD)</Text>
              <View style={styles.dateInputWrapper}>
                <TextInput style={styles.dateInput} placeholder="2025-12-31" placeholderTextColor={Colors.outline + '66'} value={selectedDate} onChangeText={setSelectedDate} />
                <MaterialIcons name="calendar-today" size={24} color={Colors.secondaryFixedDim} />
              </View>
              <View style={styles.quickSelect}>
                <Text style={styles.quickSelectLabel}>Quick Select</Text>
                <View style={styles.quickSelectButtons}>
                  {quickSelectDates.map((label, index) => (
                    <TouchableOpacity key={index} style={styles.quickSelectButton} activeOpacity={0.7} onPress={() => quickSelectDate(label)}>
                      <Text style={styles.quickSelectButtonText}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
            <View style={styles.imageCard}>
              <Image source={{ uri: CAPSULE_IMAGE }} style={styles.capsuleImage} resizeMode="cover" />
              <View style={styles.imageOverlay} />
              <View style={styles.imageCaption}><Text style={styles.imageCaptionText}>Your words will remain encrypted and silent until the chosen horizon.</Text></View>
            </View>
          </View>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8} onPress={handleSaveCapsule} disabled={saving}>
            {saving ? <ActivityIndicator color={Colors.onPrimary} /> : <><Text style={styles.saveButtonText}>Seal Capsule</Text><MaterialIcons name="lock" size={18} color={Colors.onPrimary} /></>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewButton} activeOpacity={0.7} onPress={fetchCapsules}>
            <MaterialIcons name="refresh" size={18} color={Colors.secondary} /><Text style={styles.viewButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>My Time Capsules</Text>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : capsules.length === 0 ? (
            <View style={styles.emptyCard}>
              <MaterialIcons name="inbox" size={32} color={Colors.onSurfaceVariant + '66'} />
              <Text style={styles.emptyCardText}>No capsules yet. Create one above.</Text>
            </View>
          ) : (
            <View style={styles.recentGrid}>
              {capsules.map((item) => {
                const status = getCapsuleStatus(item.seal_date);
                return (
                  <TouchableOpacity key={item.id} style={styles.recentCard} activeOpacity={0.7} onPress={() => handleOpenCapsule(item)}>
                    <View style={styles.recentCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <MaterialIcons name={status.icon as any} size={20} color={status.color} />
                        <Text style={[styles.recentCardDate, { color: status.color }]}>{status.text} - Opens {formatDisplayDate(item.seal_date)}</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleDeleteCapsule(item.id)}><MaterialIcons name="delete-outline" size={20} color={Colors.error} /></TouchableOpacity>
                    </View>
                    <Text style={styles.recentCardText} numberOfLines={1}>{status.text === 'Locked' ? '🔒 Message hidden until seal date' : `📖 ${item.message.substring(0, 60)}...`}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNav activeTab="capsule" />
      <Modal animationType="fade" transparent={true} visible={showContentModal} onRequestClose={() => setShowContentModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowContentModal(false)}>
          <View style={styles.contentModal}>
            <View style={styles.contentModalHeader}>
              <MaterialIcons name="lock-open" size={24} color={Colors.secondary} />
              <Text style={styles.contentModalTitle}>Your Time Capsule</Text>
              <TouchableOpacity onPress={() => setShowContentModal(false)}><MaterialIcons name="close" size={24} color={Colors.onSurfaceVariant} /></TouchableOpacity>
            </View>
            <View style={styles.contentModalBody}>
              <Text style={styles.contentModalDate}>Sealed on: {selectedCapsule && formatDisplayDate(selectedCapsule.created_at)}</Text>
              <Text style={styles.contentModalMessage}>{capsuleContent}</Text>
              <Text style={styles.contentModalFooter}>From your past self to your present self 💫</Text>
            </View>
          </View>
        </Pressable>
      </Modal>
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
  quickSelectButtons: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  quickSelectButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: Colors.surfaceContainerHigh, borderRadius: 20, borderWidth: 1, borderColor: Colors.outlineVariant + '30' },
  quickSelectButtonText: { fontSize: 13, fontWeight: '500', color: Colors.onSurfaceVariant },
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
  recentCardDate: { fontSize: 10, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase' },
  recentCardText: { fontSize: 14, fontWeight: '400', color: Colors.onSurface, fontStyle: 'italic' },
  emptyCard: { padding: 40, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.outlineVariant + '66', borderRadius: 12, alignItems: 'center', gap: 12 },
  emptyCardText: { fontSize: 12, fontWeight: '500', letterSpacing: 1, textTransform: 'uppercase', color: Colors.onSurfaceVariant + '66', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  contentModal: { width: '85%', backgroundColor: Colors.surface, borderRadius: 24, overflow: 'hidden' },
  contentModalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + '40' },
  contentModalTitle: { fontSize: 18, fontWeight: '500', color: Colors.onSurface, flex: 1, textAlign: 'center' },
  contentModalBody: { padding: 24, gap: 16 },
  contentModalDate: { fontSize: 12, color: Colors.onSurfaceVariant, textAlign: 'center' },
  contentModalMessage: { fontSize: 16, lineHeight: 24, color: Colors.onSurface, textAlign: 'center', fontStyle: 'italic' },
  contentModalFooter: { fontSize: 11, color: Colors.secondary, textAlign: 'center', marginTop: 16, letterSpacing: 1, textTransform: 'uppercase' },
});
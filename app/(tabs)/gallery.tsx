import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  Share
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';
import { api } from '../../services/api';

interface Artwork {
  id: string;
  feeling: string;
  imageUrl: string;
  caption: string;
  voiceNoteUri: string | null;
  generatedDate: string;
}

export default function GalleryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [savingImage, setSavingImage] = useState(false);

  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const fetchArtworks = useCallback(async () => {
    try {
      const response = await api.get('/artworks');
      const sorted = response.data.sort((a: Artwork, b: Artwork) => 
        new Date(b.generatedDate).getTime() - new Date(a.generatedDate).getTime()
      );
      setArtworks(sorted);
    } catch (err) {
      console.error('Error fetching artworks:', err);
      Alert.alert('Error', 'Failed to load gallery');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to save images to your gallery');
      }
    })();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArtworks();
  };

  const handleDeleteArtwork = (id: string) => {
    Alert.alert(
      'Delete Artwork',
      'Are you sure you want to remove this from your gallery?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/artworks/${id}`);
              fetchArtworks();
              Alert.alert('Deleted', 'Artwork removed from gallery');
            } catch (err) {
              console.error(err);
              Alert.alert('Error', 'Failed to delete');
            }
          }
        }
      ]
    );
  };

  // Save image to gallery menggunakan fetch + MediaLibrary (tanpa FileSystem)
  const handleSaveImage = async (imageUrl: string) => {
    setSavingImage(true);
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result;
        if (typeof base64 === 'string') {
          await MediaLibrary.createAssetAsync(base64);
          Alert.alert('Success', 'Image saved to your gallery!');
        }
      };
      reader.readAsDataURL(blob);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    } finally {
      setSavingImage(false);
    }
  };

  const handleShare = async (imageUrl: string, feeling: string) => {
    try {
      await Share.share({
        message: `My emotional artwork: "${feeling}"\nCreated with SoulCanvas`,
        url: imageUrl,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const openDetailModal = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
      <StatusBar style="dark" backgroundColor={Colors.surface} />
      <Header />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerHeight + 20,
            paddingBottom: bottomNavHeight + 24,
          },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
        }
      >
        <View style={styles.headerSection}>
          <Text style={styles.badge}>Your Emotional Gallery</Text>
          <Text style={styles.title}>Visual Journal{'\n'}of Your Soul</Text>
          <Text style={styles.subtitle}>
            Tap on any artwork to view details, save, or share
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.createButton}
          onPress={() => router.push('/(tabs)/compose')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="add" size={20} color={Colors.onPrimary} />
          <Text style={styles.createButtonText}>Create New Artwork</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} style={styles.loader} />
        ) : artworks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="collections" size={64} color={Colors.onSurfaceVariant + '40'} />
            <Text style={styles.emptyTitle}>No artworks yet</Text>
            <Text style={styles.emptyText}>
              Go to Compose and write your feeling to create your first emotional artwork
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/compose')}
            >
              <Text style={styles.emptyButtonText}>Start Creating</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.galleryList}>
            {artworks.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.artworkCard}
                onPress={() => openDetailModal(item)}
                activeOpacity={0.9}
              >
                <Image source={{ uri: item.imageUrl }} style={styles.artworkImage} />
                <View style={styles.artworkOverlay}>
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteArtwork(item.id);
                    }}
                  >
                    <MaterialIcons name="delete-outline" size={20} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <View style={styles.artworkInfo}>
                  <View style={styles.feelingTag}>
                    <MaterialIcons name="format-quote" size={14} color={Colors.secondary} />
                    <Text style={styles.feelingText} numberOfLines={2}>
                      {`"${item.feeling}"`}
                    </Text>
                  </View>
                  
                  {item.caption && (
                    <View style={styles.captionContainer}>
                      <MaterialIcons name="lightbulb" size={14} color={Colors.secondaryFixedDim} />
                      <Text style={styles.captionText} numberOfLines={2}>
                        {item.caption}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.dateRow}>
                    <MaterialIcons name="schedule" size={12} color={Colors.onSurfaceVariant + '80'} />
                    <Text style={styles.dateText}>{formatDate(item.generatedDate)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {selectedArtwork && (
                <>
                  <Image source={{ uri: selectedArtwork.imageUrl }} style={styles.modalImage} />
                  
                  <TouchableOpacity 
                    style={styles.modalCloseButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <MaterialIcons name="close" size={24} color={Colors.onSurface} />
                  </TouchableOpacity>
                  
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>What you felt</Text>
                    <Text style={styles.modalFeelingText}>
                      {`"${selectedArtwork.feeling}"`}
                    </Text>
                  </View>
                  
                  {selectedArtwork.caption && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Interpretation</Text>
                      <Text style={styles.modalCaptionText}>
                        {selectedArtwork.caption}
                      </Text>
                    </View>
                  )}
                  
                  {selectedArtwork.voiceNoteUri && (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalLabel}>Voice Note</Text>
                      <TouchableOpacity style={styles.voiceNoteButton}>
                        <MaterialIcons name="play-circle" size={24} color={Colors.secondary} />
                        <Text style={styles.voiceNoteText}>Play Voice Note</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  
                  <View style={styles.modalSection}>
                    <Text style={styles.modalLabel}>Created on</Text>
                    <Text style={styles.modalDateText}>
                      {formatDate(selectedArtwork.generatedDate)}
                    </Text>
                  </View>
                  
                  <View style={styles.modalActions}>
                    <TouchableOpacity 
                      style={[styles.modalActionButton, styles.saveButton]}
                      onPress={() => handleSaveImage(selectedArtwork.imageUrl)}
                      disabled={savingImage}
                    >
                      {savingImage ? (
                        <ActivityIndicator size="small" color={Colors.onPrimary} />
                      ) : (
                        <>
                          <MaterialIcons name="download" size={20} color={Colors.onPrimary} />
                          <Text style={styles.modalActionText}>Save to Gallery</Text>
                        </>
                      )}
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.modalActionButton, styles.shareButton]}
                      onPress={() => handleShare(selectedArtwork.imageUrl, selectedArtwork.feeling)}
                    >
                      <MaterialIcons name="share" size={20} color={Colors.onPrimary} />
                      <Text style={styles.modalActionText}>Share</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <BottomNav activeTab="gallery" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { alignItems: 'center', paddingHorizontal: 24 },
  headerSection: { alignItems: 'center', marginBottom: 24, width: '100%' },
  badge: { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: Colors.secondary, marginBottom: 12 },
  title: { fontSize: 36, fontWeight: '300', textAlign: 'center', color: Colors.onSurface, lineHeight: 44, marginBottom: 12 },
  subtitle: { fontSize: 14, textAlign: 'center', color: Colors.onSurfaceVariant, lineHeight: 20, maxWidth: 280 },
  createButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 40,
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  createButtonText: { fontSize: 14, fontWeight: '500', color: Colors.onPrimary },
  loader: { marginTop: 40 },
  emptyContainer: { alignItems: 'center', marginTop: 40, gap: 16, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '500', color: Colors.onSurfaceVariant },
  emptyText: { fontSize: 14, color: Colors.onSurfaceVariant + '80', textAlign: 'center', lineHeight: 20 },
  emptyButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: Colors.secondaryContainer + '66', borderRadius: 30, marginTop: 8 },
  emptyButtonText: { fontSize: 14, fontWeight: '500', color: Colors.onSecondaryContainer },
  galleryList: { width: '100%', gap: 20, paddingBottom: 20 },
  artworkCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.onSurface,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  artworkImage: { width: '100%', height: 220 },
  artworkOverlay: { position: 'absolute', top: 12, right: 12 },
  deleteButton: {
    backgroundColor: Colors.surface + 'CC',
    padding: 8,
    borderRadius: 20,
  },
  artworkInfo: { padding: 16, gap: 10 },
  feelingTag: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  feelingText: { flex: 1, fontSize: 15, fontWeight: '400', color: Colors.onSurface, fontStyle: 'italic', lineHeight: 22 },
  captionContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: Colors.primaryContainer + '15', padding: 10, borderRadius: 12 },
  captionText: { flex: 1, fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  dateText: { fontSize: 11, color: Colors.onSurfaceVariant + '80' },
  
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxHeight: '85%', backgroundColor: Colors.surface, borderRadius: 24, overflow: 'hidden' },
  modalImage: { width: '100%', height: 300 },
  modalCloseButton: { position: 'absolute', top: 16, right: 16, backgroundColor: Colors.surface + 'CC', padding: 8, borderRadius: 20 },
  modalSection: { paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant + '30' },
  modalLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.onSurfaceVariant, marginBottom: 8 },
  modalFeelingText: { fontSize: 18, fontWeight: '300', fontStyle: 'italic', color: Colors.onSurface, lineHeight: 26 },
  modalCaptionText: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
  modalDateText: { fontSize: 14, color: Colors.onSurface },
  voiceNoteButton: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8 },
  voiceNoteText: { fontSize: 14, color: Colors.secondary },
  modalActions: { flexDirection: 'row', gap: 12, padding: 20 },
  modalActionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 30 },
  saveButton: { backgroundColor: Colors.primary },
  shareButton: { backgroundColor: Colors.secondary },
  modalActionText: { fontSize: 14, fontWeight: '500', color: Colors.onPrimary },
});
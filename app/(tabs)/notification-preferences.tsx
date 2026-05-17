import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { Header, BottomNav } from '@/components/common';
import { Colors } from '@/constants/Colors';

export default function NotificationPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const headerHeight = insets.top + 80;
  const bottomNavHeight = 70 + (Platform.OS === 'ios' ? insets.bottom : 20);

  const [newArtReminders, setNewArtReminders] = useState(true);
  const [timeCapsuleAlerts, setTimeCapsuleAlerts] = useState(false);
  const [communityUpdates, setCommunityUpdates] = useState(true);
  const [galleryNewsletters, setGalleryNewsletters] = useState(false);

  const preferences = [
    {
      icon: 'palette',
      title: 'New Art Reminders',
      description: 'Daily prompts to ignite your creative process and explore new canvases (every day at 9 PM to journal your feeling).',
      value: newArtReminders,
      onValueChange: setNewArtReminders,
    },
    {
      icon: 'history',
      title: 'Time Capsule Alerts',
      description: 'Receive occasional reflections of your past works and artistic journeys.',
      value: timeCapsuleAlerts,
      onValueChange: setTimeCapsuleAlerts,
    },
    {
      icon: 'groups',
      title: 'Community Updates',
      description: 'Stay informed about new features, community events, and creative challenges.',
      value: communityUpdates,
      onValueChange: setCommunityUpdates,
    },
    {
      icon: 'mail',
      title: 'Gallery Newsletters',
      description: 'Weekly digest of featured artists, inspirational stories, and curated collections.',
      value: galleryNewsletters,
      onValueChange: setGalleryNewsletters,
    },
  ];

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
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.badge}>Settings</Text>
          <Text style={styles.title}>Notification{'\n'}Preferences</Text>
          <Text style={styles.subtitle}>
            Tailor your digital sanctuary. Choose when you{"'"}d like to be invited back into the flow of creativity.
          </Text>
        </View>

        {/* Preferences List */}
        <View style={styles.preferencesContainer}>
          {preferences.map((item, index) => (
            <View key={index} style={styles.preferenceCard}>
              <View style={styles.preferenceLeft}>
                <View style={[styles.iconContainer, { backgroundColor: `${Colors.primary}10` }]}>
                  <MaterialIcons name={item.icon as any} size={24} color={Colors.primary} />
                </View>
                <View style={styles.preferenceText}>
                  <Text style={styles.preferenceTitle}>{item.title}</Text>
                  <Text style={styles.preferenceDescription}>{item.description}</Text>
                </View>
              </View>
              <Switch
                value={item.value}
                onValueChange={item.onValueChange}
                trackColor={{ false: Colors.surfaceContainerHighest, true: Colors.primary }}
                thumbColor={Colors.surface}
              />
            </View>
          ))}
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
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
  preferencesContainer: { width: '100%', gap: 16, marginBottom: 32 },
  preferenceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: `${Colors.surfaceContainerLow}80`,
    borderRadius: 24,
    padding: 16,
    gap: 16,
  },
  preferenceLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 16 },
  iconContainer: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  preferenceText: { flex: 1, gap: 4 },
  preferenceTitle: { fontSize: 16, fontWeight: '500', color: Colors.onSurface },
  preferenceDescription: { fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16 },
  saveButton: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: 40, alignItems: 'center', width: '100%', marginBottom: 20 },
  saveButtonText: { fontSize: 14, fontWeight: '500', letterSpacing: 1.5, textTransform: 'uppercase', color: Colors.onPrimary },
});
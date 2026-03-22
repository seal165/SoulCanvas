import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export const BentoCards = () => {
  return (
    <View style={styles.grid}>
      <View style={[styles.card, { backgroundColor: Colors.surfaceContainerLow }]}>
        <MaterialIcons name="auto-stories" size={32} color={Colors.secondary} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Time Capsule</Text>
          <Text style={styles.cardDesc}>
            Revisit the emotional landscape of your past self through archived strokes.
          </Text>
        </View>
      </View>
      <View style={[styles.card, { backgroundColor: Colors.surfaceContainerHigh }]}>
        <MaterialIcons name="bubble-chart" size={32} color={Colors.primary} />
        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>Canvas Flow</Text>
          <Text style={styles.cardDesc}>
            A seamless, AI-assisted meditative drawing experience tailored to your mood.
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { width: '100%', gap: 32, marginBottom: 40 },
  card: { padding: 32, borderRadius: 24, gap: 16, minHeight: 160 },
  cardText: { gap: 8 },
  cardTitle: { fontSize: 18, fontWeight: '500', color: Colors.onSurface },
  cardDesc: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 20 },
});
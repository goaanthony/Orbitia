import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Image, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchNasaImage, type NasaImage } from '@/services/api';

const SOLAR_SYSTEM = [
  { id: 'mercury', name: 'Mercury', size: 18, color: '#A89080', orbitRadius: 50 },
  { id: 'venus',   name: 'Venus',   size: 24, color: '#E8C87A', orbitRadius: 80 },
  { id: 'earth',   name: 'Earth',   size: 26, color: '#4A90D9', orbitRadius: 115 },
  { id: 'mars',    name: 'Mars',    size: 20, color: '#C1440E', orbitRadius: 148 },
  { id: 'jupiter', name: 'Jupiter', size: 44, color: '#C88B5A', orbitRadius: 195 },
  { id: 'saturn',  name: 'Saturn',  size: 36, color: '#E4D18A', orbitRadius: 242 },
];

export default function ExploreScreen() {
  const router = useRouter();
  const [apod, setApod] = useState<NasaImage | null>(null);
  const [apodLoading, setApodLoading] = useState(true);

  useEffect(() => {
    fetchNasaImage().then((data) => {
      setApod(data);
      setApodLoading(false);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galaxy</Text>

      {/* Solar system diagram */}
      <View style={styles.solarSystem}>
        <View style={styles.sun} />
        {SOLAR_SYSTEM.map((planet) => (
          <View
            key={planet.id + '_orbit'}
            style={[
              styles.orbit,
              {
                width: planet.orbitRadius * 2,
                height: planet.orbitRadius * 2,
                borderRadius: planet.orbitRadius,
              },
            ]}
          />
        ))}
        {SOLAR_SYSTEM.map((planet, i) => {
          const angle = (i * 55 * Math.PI) / 180;
          const x = Math.cos(angle) * planet.orbitRadius;
          const y = Math.sin(angle) * planet.orbitRadius;
          return (
            <TouchableOpacity
              key={planet.id}
              style={[
                styles.planet,
                {
                  width: planet.size,
                  height: planet.size,
                  borderRadius: planet.size / 2,
                  backgroundColor: planet.color,
                  transform: [
                    { translateX: x - planet.size / 2 },
                    { translateY: y - planet.size / 2 },
                  ],
                },
              ]}
              onPress={() =>
                router.push({ pathname: '/modal', params: { planetId: planet.id } })
              }
            />
          );
        })}
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* NASA APOD Card */}
        <View style={styles.apodSection}>
          <Text style={styles.sectionLabel}>NASA · Picture of the Day</Text>
          {apodLoading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
          ) : apod ? (
            <View style={styles.apodCard}>
              <Image source={{ uri: apod.url }} style={styles.apodImage} resizeMode="cover" />
              <View style={styles.apodInfo}>
                <Text style={styles.apodTitle}>{apod.title}</Text>
                <Text style={styles.apodDate}>{apod.date}</Text>
                <Text style={styles.apodDesc} numberOfLines={3}>
                  {apod.description}
                </Text>
              </View>
            </View>
          ) : (
            <Text style={styles.apodError}>Could not load NASA APOD.</Text>
          )}
        </View>

        {/* Planet list */}
        <Text style={{ ...styles.sectionLabel, marginTop: 24 }}>
          Solar System
        </Text>
        {SOLAR_SYSTEM.map((planet) => (
          <TouchableOpacity
            key={planet.id}
            style={styles.listRow}
            onPress={() =>
              router.push({ pathname: '/modal', params: { planetId: planet.id } })
            }
          >
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: planet.color,
                  width: planet.size * 0.6 + 8,
                  height: planet.size * 0.6 + 8,
                  borderRadius: 20,
                },
              ]}
            />
            <Text style={styles.listName}>{planet.name}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', paddingTop: 60 },
  title: {
    color: '#fff', fontSize: 18, fontWeight: '700',
    textAlign: 'center', letterSpacing: 1, marginBottom: 16,
  },
  solarSystem: {
    width: '100%', height: 260,
    alignItems: 'center', justifyContent: 'center',
  },
  sun: {
    position: 'absolute',
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: '#FFC94D',
    shadowColor: '#FFC94D', shadowRadius: 18, shadowOpacity: 0.9, elevation: 10,
  },
  orbit: {
    position: 'absolute',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderStyle: 'dashed',
  },
  planet: { position: 'absolute' },
  scroll: { flex: 1, paddingHorizontal: 20 },
  sectionLabel: {
    color: '#9CA3AF', fontSize: 11, letterSpacing: 1.5,
    textTransform: 'uppercase', marginBottom: 12,
  },
  apodSection: { marginTop: 8 },
  apodCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
  },
  apodImage: { width: '100%', height: 180 },
  apodVideoPlaceholder: {
    height: 120, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  apodVideoText: { color: '#9CA3AF', fontSize: 14 },
  apodInfo: { padding: 14 },
  apodTitle: { color: '#fff', fontSize: 14, fontWeight: '700', marginBottom: 4 },
  apodDate: { color: '#E6F358', fontSize: 11, marginBottom: 8 },
  apodDesc: { color: '#9CA3AF', fontSize: 12, lineHeight: 18 },
  apodError: { color: '#9CA3AF', fontSize: 13, marginTop: 12 },
  listRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 12, gap: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  dot: {},
  listName: { color: '#fff', fontSize: 15 },
});
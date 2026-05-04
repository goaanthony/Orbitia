import { useState } from 'react';

import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native';

import { useRouter } from 'expo-router';

import { ChevronLeft, ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PLANETS = [
  {
    id: 'earth',
    name: 'EARTH',
    subtitle: 'THE LIVING PLANET',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/240px-The_Blue_Marble_%28remastered%29.jpg',
    temp: '19°C',
    feelsLike: '22°C',
    location: 'BORDEAUX, FR',
  },
  {
    id: 'mars',
    name: 'MARS',
    subtitle: 'THE RED PLANET',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg',
    temp: '-46°C',
    feelsLike: '-50°C',
    location: 'MARS',
  },
  {
    id: 'moon',
    name: 'MOON',
    subtitle: 'EARTH\'S COMPANION',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/240px-FullMoon2010.jpg',
    temp: '-173°C',
    feelsLike: '-180°C',
    location: 'MOON',
  },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  const prev = () => setCurrentIndex((i) => (i - 1 + PLANETS.length) % PLANETS.length);
  const next = () => setCurrentIndex((i) => (i + 1) % PLANETS.length);

  const planet = PLANETS[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.appName}>SPACED</Text>
        </View>
        <Image
          source={{ uri: 'https://i.pinimg.com/736x/e3/aa/47/e3aa47f7914d1b77f0b00d99f2efea1f.jpg' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.greeting}>Hi Foutre idée,</Text>
        <Text style={styles.title}>Which planet{'\n'}would you like to explore?</Text>
      </View>

      <View style={styles.carouselContainer}>
        <TouchableOpacity style={styles.arrowBtn} onPress={prev}>
          <ChevronLeft color="#fff" size={20} />
        </TouchableOpacity>

        <View style={styles.planetWrapper}>
          <View style={[styles.ring, styles.ring1]} />
          <View style={[styles.ring, styles.ring2]} />
          <View style={[styles.ring, styles.ring3]} />
          <View style={styles.orbitDot} />

          <Image
            source={{ uri: planet.image }}
            style={styles.planetImage}
          />
          <Text style={styles.planetName}>{planet.name}</Text>
          <Text style={styles.planetSubtitle}>{planet.subtitle}</Text>

          <View style={styles.dotsRow}>
            {PLANETS.map((_, i) => (
              <View key={i} style={[styles.dot, i === currentIndex && styles.dotActive]} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={styles.arrowBtn} onPress={next}>
          <ChevronRight color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push({ pathname: '/modal', params: { planetId: planet.id } })}
      >
        <Text style={styles.buttonText}>Explore planet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 3,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  titleSection: {
    marginBottom: 16,
  },
  greeting: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 4,
    lineHeight: 30,
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  arrowBtn: {
    padding: 8,
  },
  planetWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderStyle: 'dashed',
  },
  ring1: {
    width: 200,
    height: 200,
  },
  ring2: {
    width: 240,
    height: 240,
  },
  ring3: {
    width: 280,
    height: 280,
  },
  orbitDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    top: '50%',
    left: '50%',
    marginLeft: 100,
    marginTop: -44,
  },
  planetImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  planetName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 3,
    marginTop: 20,
  },
  planetSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 16,
  },
  button: {
    backgroundColor: '#E6F358',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 16,
  },
});
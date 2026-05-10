import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const PLANETS = [
  {
    id: 'earth',
    name: 'EARTH',
    subtitle: 'THE LIVING PLANET',
    image: 'https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~orig.jpg',
  },
  {
    id: 'mars',
    name: 'MARS',
    subtitle: 'THE RED PLANET',
    image: 'https://images-assets.nasa.gov/image/PIA00407/PIA00407~orig.jpg',
  },
  {
    id: 'moon',
    name: 'MOON',
    subtitle: "EARTH'S COMPANION",
    image: 'https://images-assets.nasa.gov/image/PIA00405/PIA00405~orig.jpg',
  },
];

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(page);
  };

  const goToPage = (i: number) => {
    scrollRef.current?.scrollTo({ x: i * width, animated: true });
    setCurrentIndex(i);
  };

  const planet = PLANETS[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>Orbitia</Text>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Which planet{'\n'}would you like to explore?</Text>
      </View>

      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate="fast"
          scrollEventThrottle={16}
          contentContainerStyle={{ alignItems: 'center' }}
        >
          {PLANETS.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.slide}
              activeOpacity={0.85}
              onPress={() =>
                router.push({ pathname: '/modal', params: { planetId: p.id } })
              }
            >
              <View style={[styles.ring, styles.ring1]} />
              <View style={[styles.ring, styles.ring2]} />
              <View style={[styles.ring, styles.ring3]} />
              <View style={styles.orbitDot} />

              <Image
                source={{ uri: p.image }}
                style={styles.planetImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.planetName}>{planet.name}</Text>
      <Text style={styles.planetSubtitle}>{planet.subtitle}</Text>

      <View style={styles.selectorRow}>
        {PLANETS.map((p, i) => (
          <TouchableOpacity
            key={p.id}
            style={[styles.selectorItem, i === currentIndex && styles.selectorItemActive]}
            onPress={() => goToPage(i)}
            activeOpacity={0.7}
          >
            <Image source={{ uri: p.image }} style={styles.selectorImage} />
            <Text
              style={[
                styles.selectorName,
                i === currentIndex && styles.selectorNameActive,
              ]}
            >
              {p.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dots}>
        {PLANETS.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === currentIndex && styles.dotActive]}
          />
        ))}
      </View>
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

  carouselWrapper: {
    flex: 1,
    marginHorizontal: -24,
  },
  slide: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: 1000,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderStyle: 'dashed',
  },
  ring1: { width: 200, height: 200 },
  ring2: { width: 240, height: 240 },
  ring3: { width: 280, height: 280 },
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
    textAlign: 'center',
    marginTop: 12,
  },
  planetSubtitle: {
    color: '#9CA3AF',
    fontSize: 11,
    letterSpacing: 1,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 20,
  },

  selectorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 16,
  },
  selectorItem: {
    alignItems: 'center',
    gap: 6,
    opacity: 0.4,
  },
  selectorItemActive: {
    opacity: 1,
  },
  selectorImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectorName: {
    color: '#9CA3AF',
    fontSize: 9,
    letterSpacing: 1.5,
    fontWeight: '600',
  },
  selectorNameActive: {
    color: '#fff',
  },

  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  dotActive: {
    backgroundColor: '#E6F358',
    width: 16,
  },
});
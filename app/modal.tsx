import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react-native';
import {
  fetchWeatherForecast, fetchCurrentWeather,
  weatherIconToEmoji, formatForecastDate, pickDailyForecasts,
  type ForecastEntry,
} from '@/services/api';

const PLANET_STATIC: Record<string, {
  name: string; location: string; temp: string; feelsLike: string;
  image: string;
  forecast: { day: string; date: string; temp: string; icon: string }[];
}> = {
  mars: {
    name: 'MARS', location: 'MARS',
    temp: '-46°C', feelsLike: '-50°C',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/240px-OSIRIS_Mars_true_color.jpg',
    forecast: [
      { day: 'Sol 1', date: '14 Apr', temp: '-40°C', icon: '💨' },
      { day: 'Sol 2', date: '15 Apr', temp: '-55°C', icon: '💨' },
      { day: 'Sol 3', date: '16 Apr', temp: '-48°C', icon: '💨' },
      { day: 'Sol 4', date: '17 Apr', temp: '-60°C', icon: '❄️' },
      { day: 'Sol 5', date: '18 Apr', temp: '-43°C', icon: '💨' },
    ],
  },
  moon: {
    name: 'MOON', location: 'MOON',
    temp: '-173°C', feelsLike: '-180°C',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/240px-FullMoon2010.jpg',
    forecast: [
      { day: 'Day 1', date: '14 Apr', temp: '-170°C', icon: '🌑' },
      { day: 'Day 2', date: '15 Apr', temp: '-175°C', icon: '🌑' },
      { day: 'Day 3', date: '16 Apr', temp: '-180°C', icon: '🌑' },
      { day: 'Day 4', date: '17 Apr', temp: '-165°C', icon: '🌑' },
      { day: 'Day 5', date: '18 Apr', temp: '-172°C', icon: '🌑' },
    ],
  },
};

const EARTH_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/The_Blue_Marble_%28remastered%29.jpg/240px-The_Blue_Marble_%28remastered%29.jpg';

type DailyRow = { day: string; date: string; temp: string; icon: string };

export default function PlanetDetail() {
  const { planetId, city, country } = useLocalSearchParams<{
    planetId: string; city?: string; country?: string;
  }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('BORDEAUX, FR');
  const [temp, setTemp] = useState('—');
  const [feelsLike, setFeelsLike] = useState('—');
  const [forecast, setForecast] = useState<DailyRow[]>([]);
  const [dateStr, setDateStr] = useState('');

  const isEarth = !planetId || planetId === 'earth';
  const staticData = !isEarth ? (PLANET_STATIC[planetId] ?? PLANET_STATIC.mars) : null;
  const planetImage = isEarth ? EARTH_IMAGE : staticData!.image;

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString('en-US', {
        day: 'numeric', month: 'long',
      }) + ', ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );

    if (!isEarth) {
      setLocation(staticData!.location);
      setTemp(staticData!.temp);
      setFeelsLike(staticData!.feelsLike);
      setForecast(staticData!.forecast);
      return;
    }

    const targetCity = city || 'Bordeaux';
    const targetCountry = country || 'FR';
    setLocation(`${targetCity.toUpperCase()}, ${targetCountry.toUpperCase()}`);
    setLoading(true);

    Promise.all([
      fetchCurrentWeather(targetCity, targetCountry),
      fetchWeatherForecast(targetCity, targetCountry),
    ])
      .then(([current, forecastData]) => {
        if (current?.main) {
          setTemp(`${Math.round(current.main.temp)}°C`);
          setFeelsLike(`${Math.round(current.main.feels_like)}°C`);
          if (current.name && current.sys?.country) {
            setLocation(`${current.name.toUpperCase()}, ${current.sys.country}`);
          }
        }
        if (forecastData?.list) {
          const daily = pickDailyForecasts(forecastData.list, 5);
          setForecast(
            daily.map((e: ForecastEntry) => {
              const { day, date } = formatForecastDate(e.dt_txt);
              return {
                day,
                date,
                temp: `${Math.round(e.main.temp)}°C`,
                icon: weatherIconToEmoji(e.weather[0]?.icon ?? ''),
              };
            })
          );
        }
      })
      .finally(() => setLoading(false));
  }, [planetId, city, country]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: planetImage }} style={styles.bgPlanet} />
      <View style={styles.overlay} />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <X color="#fff" size={18} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.locationText}>{location}</Text>
            <Text style={styles.date}>Today, {dateStr}</Text>
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" size="large" style={{ marginTop: 60, marginBottom: 20 }} />
        ) : (
          <>
            <Text style={styles.temp}>{temp}</Text>
            <Text style={styles.feelsLike}>Feels like: {feelsLike}</Text>
          </>
        )}

        {forecast.length > 0 && (
          <View style={styles.forecastCard}>
            <Text style={styles.forecastTitle}>5 Days Forecast:</Text>
            {forecast.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.forecastRow,
                  i < forecast.length - 1 && styles.forecastRowBorder,
                ]}
              >
                <Text style={styles.forecastIcon}>{item.icon}</Text>
                <Text style={styles.forecastTemp}>{item.temp}</Text>
                <Text style={styles.forecastDate}>
                  {item.day}, {item.date}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  bgPlanet: {
    position: 'absolute', top: 30, right: -30,
    width: 200, height: 200, borderRadius: 100, opacity: 0.9,
  },
  overlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(10,22,40,0.55)',
  },
  content: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 16 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  locationText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 1 },
  date: { color: '#9CA3AF', fontSize: 11, marginTop: 2 },
  temp: { color: '#fff', fontSize: 90, fontWeight: '800', lineHeight: 100, marginTop: 20 },
  feelsLike: { color: 'rgba(255,255,255,0.75)', fontSize: 18, marginBottom: 36 },
  forecastCard: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20, padding: 20,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  forecastTitle: { color: '#9CA3AF', fontSize: 13, marginBottom: 16, letterSpacing: 0.5 },
  forecastRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  forecastRowBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.08)' },
  forecastIcon: { fontSize: 22, width: 36 },
  forecastTemp: { color: '#fff', fontSize: 16, fontWeight: '600', width: 70 },
  forecastDate: { color: '#9CA3AF', fontSize: 13, flex: 1, textAlign: 'right' },
});
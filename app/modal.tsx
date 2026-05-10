import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, Image, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react-native';
import {
  fetchWeatherForecast, fetchCurrentWeather, fetchMarsWeather,
  weatherIconToEmoji, formatForecastDate, pickDailyForecasts,
  type ForecastEntry, type InSightData,
} from '@/services/api';

const EARTH_IMAGE =
  'https://images-assets.nasa.gov/image/as17-148-22727/as17-148-22727~orig.jpg';
const MARS_IMAGE =
  'https://images-assets.nasa.gov/image/PIA00407/PIA00407~orig.jpg';

const MOON_STATIC = {
  name: 'MOON', location: 'MOON',
  temp: '-173°C', feelsLike: '-180°C',
  image: 'https://images-assets.nasa.gov/image/PIA00405/PIA00405~orig.jpg',
  forecast: [
    { day: 'Day 1', date: '', temp: '-170°C', icon: '🌑' },
    { day: 'Day 2', date: '', temp: '-175°C', icon: '🌑' },
    { day: 'Day 3', date: '', temp: '-180°C', icon: '🌑' },
    { day: 'Day 4', date: '', temp: '-165°C', icon: '🌑' },
    { day: 'Day 5', date: '', temp: '-172°C', icon: '🌑' },
  ],
};

type DailyRow = { day: string; date: string; temp: string; icon: string };

export default function PlanetDetail() {
  const { planetId, city, country } = useLocalSearchParams<{
    planetId?: string;
    city?: string;
    country?: string;
  }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState('BORDEAUX, FR');
  const [temp, setTemp] = useState('—');
  const [feelsLike, setFeelsLike] = useState('—');
  const [forecast, setForecast] = useState<DailyRow[]>([]);
  const [dateStr, setDateStr] = useState('');
  const [marsNote, setMarsNote] = useState('');   // InSight disclaimer
  const [marsExtra, setMarsExtra] = useState(''); // pressure / wind info
  const [planetImage, setPlanetImage] = useState(EARTH_IMAGE);
  const [planetName, setPlanetName] = useState('EARTH');

  // Déterminer le type de contenu
  const isCity = !!(city && country); // Si city et country sont définis, c'est une ville
  const isEarth = !isCity && (!planetId || planetId === 'earth');
  const isMars = !isCity && planetId === 'mars';
  const isMoon = !isCity && planetId === 'moon';

  useEffect(() => {
    const now = new Date();
    setDateStr(
      now.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }) +
        ', ' +
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    );

    // Gérer les trois cas: ville, mars, lune, ou earth
    if (isCity && city) {
      // 🌍 C'est une vraie ville!
      setPlanetImage(EARTH_IMAGE);
      setPlanetName('EARTH');
      loadCityWeather(city, country);
    } else if (isMoon) {
      // 🌙 Lune
      setPlanetImage(MOON_STATIC.image);
      setPlanetName('MOON');
      setLocation(MOON_STATIC.location);
      setTemp(MOON_STATIC.temp);
      setFeelsLike(MOON_STATIC.feelsLike);
      setForecast(MOON_STATIC.forecast);
    } else if (isMars) {
      // 🔴 Mars
      setPlanetImage(MARS_IMAGE);
      setPlanetName('MARS');
      loadMarsWeather();
    } else {
      // 🌎 Earth (par défaut)
      setPlanetImage(EARTH_IMAGE);
      setPlanetName('EARTH');
      setLoading(true);
      loadEarthWeather();
    }
  }, [planetId, city, country, isCity, isMoon, isMars]);

  async function loadCityWeather(cityName: string, countryCode?: string) {
    setLoading(true);
    try {
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather(cityName, countryCode),
        fetchWeatherForecast(cityName, countryCode),
      ]);

      if (current) {
        setLocation(
          `${current.name?.toUpperCase() || cityName.toUpperCase()}, ${current.sys?.country || countryCode || ''}`
        );
        setTemp(`${Math.round(current.main?.temp ?? 0)}°C`);
        setFeelsLike(`${Math.round(current.main?.feels_like ?? 0)}°C`);
      }

      if (forecastData?.list?.length) {
        const daily = pickDailyForecasts(forecastData.list);
        setForecast(
          daily.map((entry) => ({
            day: formatForecastDate(entry.dt_txt).split(' ')[0],
            date: formatForecastDate(entry.dt_txt).split(' ')[1] ?? '',
            temp: `${Math.round(entry.main.temp)}°C`,
            icon: weatherIconToEmoji(entry.weather[0]?.icon ?? ''),
          }))
        );
      }
    } catch (e) {
      console.error('[loadCityWeather]', e);
      setTemp('—');
      setFeelsLike('—');
    } finally {
      setLoading(false);
    }
  }

  async function loadMarsWeather() {
    setLoading(true);
    setLocation('JEZERO CRATER, MARS');

    try {
      const data: InSightData | null = await fetchMarsWeather();

      if (data && data.latestSol) {
        const sol = data.latestSol;
        const avgTemp = sol.AT?.av != null ? `${Math.round(sol.AT.av)}°C` : '-46°C';
        const minTemp = sol.AT?.mn != null ? `${Math.round(sol.AT.mn)}°C` : null;

        setTemp(avgTemp);
        setFeelsLike(minTemp ?? '-50°C');
        setMarsNote(`Last recorded by NASA InSight lander · Sol ${sol.sol}`);

        const parts: string[] = [];
        if (sol.PRE?.av) parts.push(`Pressure: ${Math.round(sol.PRE.av)} Pa`);
        if (sol.HWS?.av) parts.push(`Wind: ${sol.HWS.av.toFixed(1)} m/s`);
        if (sol.WD?.most_common?.compass_point) parts.push(`Dir: ${sol.WD.most_common.compass_point}`);
        setMarsExtra(parts.join('   ·   '));

        const rows: DailyRow[] = data.sols.slice(-5).map((s, i) => ({
          day: `Sol ${s.sol}`,
          date: '',
          temp: s.AT?.av != null ? `${Math.round(s.AT.av)}°C` : '—',
          icon: (s.HWS?.av ?? 0) > 10 ? '💨' : '🌫',
        }));
        setForecast(rows);
      } else {
        setTemp('-46°C');
        setFeelsLike('-50°C');
        setMarsNote('InSight data unavailable · Showing typical values');
        setForecast([
          { day: 'Sol 1', date: '', temp: '-40°C', icon: '🌫' },
          { day: 'Sol 2', date: '', temp: '-55°C', icon: '💨' },
          { day: 'Sol 3', date: '', temp: '-48°C', icon: '🌫' },
          { day: 'Sol 4', date: '', temp: '-60°C', icon: '❄️' },
          { day: 'Sol 5', date: '', temp: '-43°C', icon: '💨' },
        ]);
      }
    } catch (e) {
      console.error('[loadMarsWeather]', e);
      setTemp('-46°C');
      setFeelsLike('-50°C');
    } finally {
      setLoading(false);
    }
  }

  async function loadEarthWeather() {
    try {
      const [current, forecastData] = await Promise.all([
        fetchCurrentWeather('Bordeaux', 'FR'),
        fetchWeatherForecast('Bordeaux', 'FR'),
      ]);

      if (current) {
        setLocation(`${current.name?.toUpperCase()}, ${current.sys?.country ?? 'FR'}`);
        setTemp(`${Math.round(current.main?.temp ?? 0)}°C`);
        setFeelsLike(`${Math.round(current.main?.feels_like ?? 0)}°C`);
      }

      if (forecastData?.list?.length) {
        const daily = pickDailyForecasts(forecastData.list);
        setForecast(
          daily.map((entry) => ({
            day: formatForecastDate(entry.dt_txt).split(' ')[0],
            date: formatForecastDate(entry.dt_txt).split(' ')[1] ?? '',
            temp: `${Math.round(entry.main.temp)}°C`,
            icon: weatherIconToEmoji(entry.weather[0]?.icon ?? ''),
          }))
        );
      }
    } catch (e) {
      console.error('[loadEarthWeather]', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: planetImage }} style={styles.planetImage} resizeMode="cover" />
        <View style={styles.imageOverlay} />

        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
          <X color="#fff" size={18} />
        </TouchableOpacity>

        <View style={styles.planetNameOverlay}>
          <Text style={styles.planetNameText}>{planetName}</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.locationRow}>
          <Text style={styles.locationText}>{location}</Text>
          <Text style={styles.dateText}>{dateStr}</Text>
        </View>

        {isMars && marsNote ? (
          <View style={styles.insightBadge}>
            <Text style={styles.insightText}>🛸 {marsNote}</Text>
          </View>
        ) : null}

        {loading ? (
          <ActivityIndicator color="#E6F358" style={{ marginVertical: 32 }} />
        ) : (
          <View style={styles.tempBlock}>
            <Text style={styles.tempMain}>{temp}</Text>
            <Text style={styles.tempSub}>Feels like {feelsLike}</Text>
            {isMars && marsExtra ? (
              <Text style={styles.marsExtra}>{marsExtra}</Text>
            ) : null}
          </View>
        )}

        {forecast.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>
              {isMars ? 'SOL FORECAST' : '5-DAY FORECAST'}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.forecastRow}>
              {forecast.map((item, i) => (
                <View key={i} style={styles.forecastCard}>
                  <Text style={styles.forecastDay}>{item.day}</Text>
                  {item.date ? <Text style={styles.forecastDate}>{item.date}</Text> : null}
                  <Text style={styles.forecastIcon}>{item.icon}</Text>
                  <Text style={styles.forecastTemp}>{item.temp}</Text>
                </View>
              ))}
            </ScrollView>
          </>
        )}

        <View style={styles.factCard}>
          <Text style={styles.factLabel}>DID YOU KNOW</Text>
          <Text style={styles.factText}>
            {isCity
              ? 'Cities are constantly changing, shaped by millions of people and countless stories waiting to be discovered.'
              : isEarth
              ? 'Earth is the only known planet to harbour life, with over 8.7 million species catalogued so far.'
              : isMars
              ? 'A Martian day (sol) is 24 hours, 37 minutes — the most Earth-like of any planet in the solar system.'
              : "The Moon is slowly drifting away from Earth at about 3.8 cm per year — roughly the rate fingernails grow."}
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageContainer: {
    height: 260,
    position: 'relative',
  },
  planetImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetNameOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 24,
  },
  planetNameText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    color: '#9CA3AF',
    fontSize: 12,
    letterSpacing: 1,
  },
  dateText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  insightBadge: {
    backgroundColor: 'rgba(230,243,88,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(230,243,88,0.25)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 12,
  },
  insightText: {
    color: '#E6F358',
    fontSize: 11,
    letterSpacing: 0.3,
  },
  tempBlock: {
    marginVertical: 16,
  },
  tempMain: {
    color: '#fff',
    fontSize: 56,
    fontWeight: '200',
    letterSpacing: -1,
  },
  tempSub: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  marsExtra: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 6,
    letterSpacing: 0.3,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 8,
  },
  forecastRow: {
    marginBottom: 24,
  },
  forecastCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    marginRight: 10,
    alignItems: 'center',
    minWidth: 72,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  forecastDay: {
    color: '#9CA3AF',
    fontSize: 11,
    marginBottom: 2,
  },
  forecastDate: {
    color: '#6B7280',
    fontSize: 10,
    marginBottom: 6,
  },
  forecastIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  forecastTemp: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  factCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  factLabel: {
    color: '#E6F358',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 8,
  },
  factText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 22,
  },
});

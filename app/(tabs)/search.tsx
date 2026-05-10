import { useState, useEffect } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { useRouter } from 'expo-router';

import { X, Search, Heart } from 'lucide-react-native';
import { useBookmark } from '@/context/BookmarkContext';
import { fetchCurrentWeather } from '@/services/api';
import { CITY_COUNTRY_MAP } from '@/constants/cityCountryMap';

const ALL_CITIES = [
  // Europe
  { id: 'city-1', name: 'Paris', emoji: '🗼', planet: 'EARTH', title: 'Paris', location: 'France, Europe', temp: '12°C', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500&h=300&fit=crop', country: 'FR' },
  { id: 'city-2', name: 'London', emoji: '🇬🇧', planet: 'EARTH', title: 'London', location: 'UK, Europe', temp: '10°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'GB' },
  { id: 'city-3', name: 'Berlin', emoji: '🇩🇪', planet: 'EARTH', title: 'Berlin', location: 'Germany, Europe', temp: '9°C', image: 'https://images.unsplash.com/photo-1599946347371-23fbbed89681?w=500&h=300&fit=crop', country: 'DE' },
  { id: 'city-4', name: 'Rome', emoji: '🏛️', planet: 'EARTH', title: 'Rome', location: 'Italy, Europe', temp: '14°C', image: 'https://images.unsplash.com/photo-1552832860-cfb67f335084?w=500&h=300&fit=crop', country: 'IT' },
  { id: 'city-5', name: 'Barcelona', emoji: '🇪🇸', planet: 'EARTH', title: 'Barcelona', location: 'Spain, Europe', temp: '15°C', image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=500&h=300&fit=crop', country: 'ES' },
  { id: 'city-6', name: 'Amsterdam', emoji: '🚲', planet: 'EARTH', title: 'Amsterdam', location: 'Netherlands, Europe', temp: '11°C', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop', country: 'NL' },
  { id: 'city-7', name: 'Vienna', emoji: '🎼', planet: 'EARTH', title: 'Vienna', location: 'Austria, Europe', temp: '8°C', image: 'https://images.unsplash.com/photo-1516152629919-0d8ffc9d7e03?w=500&h=300&fit=crop', country: 'AT' },
  { id: 'city-8', name: 'Prague', emoji: '🏰', planet: 'EARTH', title: 'Prague', location: 'Czech Republic, Europe', temp: '7°C', image: 'https://images.unsplash.com/photo-1514890547357-a9db7a547e59?w=500&h=300&fit=crop', country: 'CZ' },
  { id: 'city-9', name: 'Athens', emoji: '⚡', planet: 'EARTH', title: 'Athens', location: 'Greece, Europe', temp: '18°C', image: 'https://images.unsplash.com/photo-1570728886206-136d0ce02e81?w=500&h=300&fit=crop', country: 'GR' },
  { id: 'city-10', name: 'Venice', emoji: '🚣', planet: 'EARTH', title: 'Venice', location: 'Italy, Europe', temp: '13°C', image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=500&h=300&fit=crop', country: 'IT' },

  // Asia
  { id: 'city-11', name: 'Tokyo', emoji: '🗾', planet: 'EARTH', title: 'Tokyo', location: 'Japan, Asia', temp: '18°C', image: 'https://images.unsplash.com/photo-1540959375944-7049f642e9b5?w=500&h=300&fit=crop', country: 'JP' },
  { id: 'city-12', name: 'Bangkok', emoji: '🛕', planet: 'EARTH', title: 'Bangkok', location: 'Thailand, Southeast Asia', temp: '32°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'TH' },
  { id: 'city-13', name: 'Singapore', emoji: '🌴', planet: 'EARTH', title: 'Singapore', location: 'Singapore, Asia', temp: '28°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'SG' },
  { id: 'city-14', name: 'Hong Kong', emoji: '🏙️', planet: 'EARTH', title: 'Hong Kong', location: 'Hong Kong, Asia', temp: '22°C', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop', country: 'HK' },
  { id: 'city-15', name: 'Seoul', emoji: '🇰🇷', planet: 'EARTH', title: 'Seoul', location: 'South Korea, Asia', temp: '15°C', image: 'https://images.unsplash.com/photo-1552832860-cfb67f335084?w=500&h=300&fit=crop', country: 'KR' },
  { id: 'city-16', name: 'Delhi', emoji: '🇮🇳', planet: 'EARTH', title: 'Delhi', location: 'India, Asia', temp: '35°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'IN' },
  { id: 'city-17', name: 'Mumbai', emoji: '🌊', planet: 'EARTH', title: 'Mumbai', location: 'India, Asia', temp: '32°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'IN' },
  { id: 'city-18', name: 'Bali', emoji: '🏝️', planet: 'EARTH', title: 'Bali', location: 'Indonesia, Asia', temp: '29°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'ID' },
  { id: 'city-19', name: 'Manila', emoji: '🇵🇭', planet: 'EARTH', title: 'Manila', location: 'Philippines, Asia', temp: '30°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'PH' },
  { id: 'city-20', name: 'Hanoi', emoji: '🏯', planet: 'EARTH', title: 'Hanoi', location: 'Vietnam, Asia', temp: '28°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'VN' },

  // North America
  { id: 'city-21', name: 'New York', emoji: '🗽', planet: 'EARTH', title: 'New York', location: 'USA, North America', temp: '15°C', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-22', name: 'Los Angeles', emoji: '🌴', planet: 'EARTH', title: 'Los Angeles', location: 'USA, North America', temp: '22°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-23', name: 'Chicago', emoji: '🌆', planet: 'EARTH', title: 'Chicago', location: 'USA, North America', temp: '12°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-24', name: 'San Francisco', emoji: '🌉', planet: 'EARTH', title: 'San Francisco', location: 'USA, North America', temp: '18°C', image: 'https://images.unsplash.com/photo-1552832860-cfb67f335084?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-25', name: 'Toronto', emoji: '🇨🇦', planet: 'EARTH', title: 'Toronto', location: 'Canada, North America', temp: '10°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'CA' },
  { id: 'city-26', name: 'Vancouver', emoji: '🏔️', planet: 'EARTH', title: 'Vancouver', location: 'Canada, North America', temp: '12°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'CA' },
  { id: 'city-27', name: 'Mexico City', emoji: '🇲🇽', planet: 'EARTH', title: 'Mexico City', location: 'Mexico, North America', temp: '20°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'MX' },
  { id: 'city-28', name: 'Las Vegas', emoji: '🎰', planet: 'EARTH', title: 'Las Vegas', location: 'USA, North America', temp: '25°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-29', name: 'Miami', emoji: '🏖️', planet: 'EARTH', title: 'Miami', location: 'USA, North America', temp: '28°C', image: 'https://images.unsplash.com/photo-1483729558449-99daa64073d9?w=500&h=300&fit=crop', country: 'US' },
  { id: 'city-30', name: 'Orlando', emoji: '🎢', planet: 'EARTH', title: 'Orlando', location: 'USA, North America', temp: '26°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'US' },

  // South America
  { id: 'city-31', name: 'Rio de Janeiro', emoji: '🏄', planet: 'EARTH', title: 'Rio de Janeiro', location: 'Brazil, South America', temp: '28°C', image: 'https://images.unsplash.com/photo-1483729558449-99daa64073d9?w=500&h=300&fit=crop', country: 'BR' },
  { id: 'city-32', name: 'São Paulo', emoji: '🇧🇷', planet: 'EARTH', title: 'São Paulo', location: 'Brazil, South America', temp: '25°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'BR' },
  { id: 'city-33', name: 'Salvador', emoji: '🌴', planet: 'EARTH', title: 'Salvador', location: 'Brazil, South America', temp: '30°C', image: 'https://images.unsplash.com/photo-1483729558449-99daa64073d9?w=500&h=300&fit=crop', country: 'BR' },
  { id: 'city-34', name: 'Buenos Aires', emoji: '🇦🇷', planet: 'EARTH', title: 'Buenos Aires', location: 'Argentina, South America', temp: '18°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'AR' },
  { id: 'city-35', name: 'Lima', emoji: '🇵🇪', planet: 'EARTH', title: 'Lima', location: 'Peru, South America', temp: '20°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'PE' },
  { id: 'city-36', name: 'Bogotá', emoji: '🏔️', planet: 'EARTH', title: 'Bogotá', location: 'Colombia, South America', temp: '15°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'CO' },
  { id: 'city-37', name: 'Santiago', emoji: '🇨🇱', planet: 'EARTH', title: 'Santiago', location: 'Chile, South America', temp: '22°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'CL' },
  { id: 'city-38', name: 'Caracas', emoji: '🇻🇪', planet: 'EARTH', title: 'Caracas', location: 'Venezuela, South America', temp: '28°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'VE' },
  { id: 'city-39', name: 'Quito', emoji: '🌋', planet: 'EARTH', title: 'Quito', location: 'Ecuador, South America', temp: '16°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'EC' },
  { id: 'city-40', name: 'Asunción', emoji: '🇵🇾', planet: 'EARTH', title: 'Asunción', location: 'Paraguay, South America', temp: '24°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'PY' },

  // Africa
  { id: 'city-41', name: 'Cairo', emoji: '🇪🇬', planet: 'EARTH', title: 'Cairo', location: 'Egypt, Africa', temp: '32°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'EG' },
  { id: 'city-42', name: 'Lagos', emoji: '🇳🇬', planet: 'EARTH', title: 'Lagos', location: 'Nigeria, Africa', temp: '29°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'NG' },
  { id: 'city-43', name: 'Johannesburg', emoji: '🇿🇦', planet: 'EARTH', title: 'Johannesburg', location: 'South Africa, Africa', temp: '18°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'ZA' },
  { id: 'city-44', name: 'Nairobi', emoji: '🦁', planet: 'EARTH', title: 'Nairobi', location: 'Kenya, Africa', temp: '22°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'KE' },
  { id: 'city-45', name: 'Cape Town', emoji: '🏔️', planet: 'EARTH', title: 'Cape Town', location: 'South Africa, Africa', temp: '20°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'ZA' },
  { id: 'city-46', name: 'Addis Ababa', emoji: '🇪🇹', planet: 'EARTH', title: 'Addis Ababa', location: 'Ethiopia, Africa', temp: '19°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'ET' },
  { id: 'city-47', name: 'Accra', emoji: '🇬🇭', planet: 'EARTH', title: 'Accra', location: 'Ghana, Africa', temp: '28°C', image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop', country: 'GH' },
  { id: 'city-48', name: 'Marrakech', emoji: '🕌', planet: 'EARTH', title: 'Marrakech', location: 'Morocco, Africa', temp: '26°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'MA' },
  { id: 'city-49', name: 'Casablanca', emoji: '🇲🇦', planet: 'EARTH', title: 'Casablanca', location: 'Morocco, Africa', temp: '22°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'MA' },
  { id: 'city-50', name: 'Tunis', emoji: '🇹🇳', planet: 'EARTH', title: 'Tunis', location: 'Tunisia, Africa', temp: '25°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'TN' },

  // Oceania
  { id: 'city-51', name: 'Sydney', emoji: '🦘', planet: 'EARTH', title: 'Sydney', location: 'Australia, Oceania', temp: '22°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'AU' },
  { id: 'city-52', name: 'Melbourne', emoji: '🇦🇺', planet: 'EARTH', title: 'Melbourne', location: 'Australia, Oceania', temp: '20°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'AU' },
  { id: 'city-53', name: 'Brisbane', emoji: '🌴', planet: 'EARTH', title: 'Brisbane', location: 'Australia, Oceania', temp: '25°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'AU' },
  { id: 'city-54', name: 'Perth', emoji: '🏖️', planet: 'EARTH', title: 'Perth', location: 'Australia, Oceania', temp: '24°C', image: 'https://images.unsplash.com/photo-1483729558449-99daa64073d9?w=500&h=300&fit=crop', country: 'AU' },
  { id: 'city-55', name: 'Auckland', emoji: '🇳🇿', planet: 'EARTH', title: 'Auckland', location: 'New Zealand, Oceania', temp: '18°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'NZ' },

  // Middle East
  { id: 'city-56', name: 'Dubai', emoji: '🏜️', planet: 'EARTH', title: 'Dubai', location: 'UAE, Middle East', temp: '35°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'AE' },
  { id: 'city-57', name: 'Abu Dhabi', emoji: '🕌', planet: 'EARTH', title: 'Abu Dhabi', location: 'UAE, Middle East', temp: '36°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'AE' },
  { id: 'city-58', name: 'Doha', emoji: '🇶🇦', planet: 'EARTH', title: 'Doha', location: 'Qatar, Middle East', temp: '38°C', image: 'https://images.unsplash.com/photo-1512453909280-cb0aea20d4fe?w=500&h=300&fit=crop', country: 'QA' },
  { id: 'city-59', name: 'Riyadh', emoji: '🇸🇦', planet: 'EARTH', title: 'Riyadh', location: 'Saudi Arabia, Middle East', temp: '39°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'SA' },
  { id: 'city-60', name: 'Istanbul', emoji: '🕌', planet: 'EARTH', title: 'Istanbul', location: 'Turkey, Middle East', temp: '16°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'TR' },
  { id: 'city-61', name: 'Tel Aviv', emoji: '🇮🇱', planet: 'EARTH', title: 'Tel Aviv', location: 'Israel, Middle East', temp: '24°C', image: 'https://images.unsplash.com/photo-1506973404872-a4a50e48c4d9?w=500&h=300&fit=crop', country: 'IL' },
  { id: 'city-62', name: 'Beirut', emoji: '🇱🇧', planet: 'EARTH', title: 'Beirut', location: 'Lebanon, Middle East', temp: '22°C', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=500&h=300&fit=crop', country: 'LB' },
  { id: 'city-63', name: 'Tehran', emoji: '🇮🇷', planet: 'EARTH', title: 'Tehran', location: 'Iran, Middle East', temp: '28°C', image: 'https://images.unsplash.com/photo-1509152470841-b42a28e7c759?w=500&h=300&fit=crop', country: 'IR' },
];

export default function SearchScreen() {
  const router = useRouter();
  const { addBookmark, isBookmarked } = useBookmark();
  const [search, setSearch] = useState('');
  const [weatherCache, setWeatherCache] = useState<Record<string, string>>({});
  const [loadingWeather, setLoadingWeather] = useState<Set<string>>(new Set());

  // Charger la météo de base pour les villes principales
  useEffect(() => {
    const loadWeatherForMainCities = async () => {
      const mainCities = ['Paris', 'London', 'Tokyo', 'New York', 'Sydney'];
      const newCache = { ...weatherCache };

      for (const city of mainCities) {
        if (!newCache[city]) {
          try {
            const weather = await fetchCurrentWeather(city);
            if (weather?.main?.temp) {
              const temp = Math.round(weather.main.temp * 10) / 10;
              newCache[city] = `${temp}°C`;
            }
          } catch (error) {
            console.error(`Error loading weather for ${city}:`, error);
          }
        }
      }
      setWeatherCache(newCache);
    };

    loadWeatherForMainCities();
  }, []);

  const filteredCities = ALL_CITIES.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase()) ||
    city.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddBookmark = async (city: typeof ALL_CITIES[0]) => {
    // Récupérer la vraie météo si pas déjà en cache
    let temp = weatherCache[city.name] || city.temp;

    if (!weatherCache[city.name]) {
      setLoadingWeather((prev) => new Set([...prev, city.id]));
      try {
        const weather = await fetchCurrentWeather(city.name, city.country);
        if (weather?.main?.temp) {
          const tempValue = Math.round(weather.main.temp * 10) / 10;
          temp = `${tempValue}°C`;
          setWeatherCache((prev) => ({ ...prev, [city.name]: temp }));
        }
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
      setLoadingWeather((prev) => {
        const newSet = new Set(prev);
        newSet.delete(city.id);
        return newSet;
      });
    }

    await addBookmark({
      ...city,
      temp,
      city: city.name, // Nom de la ville pour les appels API
      country: city.country, // Code pays ISO
      isCity: true, // C'est une vraie ville!
    });
  };

  const getDisplayTemp = (city: typeof ALL_CITIES[0]): string => {
    return weatherCache[city.name] || city.temp;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => router.back()}
        >
          <X color="#fff" size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>SEARCH</Text>
      </View>

      <View style={styles.searchRow}>
        <Search color="#9CA3AF" size={18} />
        <TextInput
          style={styles.input}
          placeholder="Search cities..."
          placeholderTextColor="#6B7280"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredCities}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const bookmarked = isBookmarked(item.id);
          const isLoading = loadingWeather.has(item.id);

          return (
            <View style={styles.row}>
              <View style={styles.rowContent}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <Text style={styles.name}>{item.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.bookmarkBtn}
                onPress={() => handleAddBookmark(item)}
                disabled={bookmarked || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#E6F358" />
                ) : (
                  <Heart
                    color={bookmarked ? '#E6F358' : '#9CA3AF'}
                    fill={bookmarked ? '#E6F358' : 'none'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07101E',
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 28,
  },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
    marginBottom: 28,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  sectionLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  rowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  emoji: {
    fontSize: 22,
    width: 36,
  },
  name: {
    color: '#fff',
    fontSize: 16,
  },
  bookmarkBtn: {
    padding: 8,
    minWidth: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});

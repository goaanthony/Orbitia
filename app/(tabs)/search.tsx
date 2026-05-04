import { useState } from 'react';

import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';

import { useRouter } from 'expo-router';

import { X, Search } from 'lucide-react-native';

const ALL_PLANETS = [
  { id: 'moon', name: 'Moon', category: 'Planets in our solar system', emoji: 'o' },
  { id: 'earth', name: 'Earth', category: 'Planets in our solar system', emoji: 'o' },
  { id: 'mars', name: 'Mars', category: 'Planets in our solar system', emoji: 'o' }
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = query.length > 0
    ? ALL_PLANETS.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
    : ALL_PLANETS;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <X color="#9CA3AF" size={18} />
        </TouchableOpacity>
        <Text style={styles.title}>SEARCH</Text>
      </View>

      <View style={styles.searchRow}>
        <Search color="#9CA3AF" size={16} style={{ marginRight: 10 }} />
        <TextInput
          style={styles.input}
          placeholder="Search planets..."
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      <Text style={styles.sectionLabel}>Planets in our solar system</Text>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => router.push({ pathname: '/modal', params: { planetId: item.id } })}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
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
    paddingVertical: 14,
    gap: 16,
  },
  emoji: {
    fontSize: 22,
    width: 36,
  },
  name: {
    color: '#fff',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
});
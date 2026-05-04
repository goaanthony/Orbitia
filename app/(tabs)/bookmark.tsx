import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { useRouter } from "expo-router";

import { MapPin } from "lucide-react-native";

const BOOKMARKS = [
  {
    id: "earth",
    planet: "EARTH",
    title: "Lofary Vibalday",
    location: "Africa, Earth",
    temp: "45°C",
    image:
      "https://i.imgflip.com/9f0uib.jpg",
  },
  {
    id: "earth2",
    planet: "EARTH",
    title: "Amazon Rainforest",
    location: "Brazil, Earth",
    temp: "32°C",
    image:
      "https://i.imgflip.com/9f0uib.jpg",
  },
  {
    id: "earth3",
    planet: "EARTH",
    title: "Monument Valley",
    location: "USA, Earth",
    temp: "28°C",
    image:
      "https://i.imgflip.com/9f0uib.jpg",
  },
];

export default function BookmarkScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bookmark</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {BOOKMARKS.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() =>
              router.push({ pathname: "/modal", params: { planetId: "earth" } })
            }
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardOverlay}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.locationRow}>
                  <MapPin color="#fff" size={12} />
                  <Text style={styles.locationText}>{item.location}</Text>
                </View>
              </View>
              <Text style={styles.tempBadge}>{item.temp}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 24,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    height: 180,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 14,
    // gradient-like fade
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardContent: {},
  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 11,
  },
  tempBadge: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: "hidden",
  },
});

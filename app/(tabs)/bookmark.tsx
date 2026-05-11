import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from "react-native";

import { useRouter } from "expo-router";

import { useBookmark } from "@/context/BookmarkContext";
import { Heart, MapPin, Trash2, RotateCcw } from "lucide-react-native";
import { useState } from "react";

export default function BookmarkScreen() {
  const router = useRouter();
  const { bookmarks, removeBookmark, refreshWeather } = useBookmark();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleRefreshWeather = async (id: string) => {
    setLoadingId(id);
    await refreshWeather(id);
    setLoadingId(null);
  };

  const handleCardPress = (item: any) => {
    // Si c'est une vraie ville (bookmark de ville), passer city et country
    if (item.isCity && item.city && item.country) {
      router.push({
        pathname: "/modal",
        params: { city: item.city, country: item.country, cityImage: item.image }
      });
    } else {
      // Sinon, c'est une planète (earth, mars, moon)
      const planetId = item.planet?.toLowerCase() || 'earth';
      router.push({
        pathname: "/modal",
        params: { planetId }
      });
    }
  };

  if (bookmarks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>FAVORITE CITIES</Text>
        <View style={styles.emptyState}>
          <Heart color="#9CA3AF" size={48} />
          <Text style={styles.emptyTitle}>No Favorites</Text>
          <Text style={styles.emptyText}>Search and add your favorite cities</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FAVORITE CITIES</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {bookmarks.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => handleCardPress(item)}
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
              <View style={styles.rightContent}>
                <View style={styles.tempSection}>
                  <Text style={styles.tempBadge}>{item.temp}</Text>
                  <TouchableOpacity
                    onPress={() => handleRefreshWeather(item.id)}
                    disabled={loadingId === item.id}
                    style={styles.refreshBtn}
                  >
                    {loadingId === item.id ? (
                      <ActivityIndicator size="small" color="#E6F358" />
                    ) : (
                      <RotateCcw color="#E6F358" size={14} />
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => removeBookmark(item.id)}
                  style={styles.deleteBtn}
                >
                  <Trash2 color="#9CA3AF" size={16} />
                </TouchableOpacity>
              </View>
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
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  emptyTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 14,
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
  rightContent: {
    alignItems: "flex-end",
    gap: 8,
  },
  tempSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
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
  refreshBtn: {
    padding: 4,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    padding: 4,
  },
});
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";

export default function TripsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Trips</Text>
          <Link href="/trips/new" asChild>
            <TouchableOpacity style={styles.postBtn}>
              <Text style={styles.postBtnText}>+ Post Trip</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text style={styles.subtitle}>Find a crew or post your own sesh.</Text>

        {/* Trip list loads here — wired to /api/trips in next sprint */}
        <View style={styles.emptyCard}>
          <Text style={styles.emptyEmoji}>🛶</Text>
          <Text style={styles.emptyTitle}>No trips posted yet</Text>
          <Text style={styles.emptyText}>Be the first to post a run.</Text>
          <Link href="/trips/new" asChild>
            <TouchableOpacity style={styles.ctaBtn}>
              <Text style={styles.ctaBtnText}>Post a Trip</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  scroll: { padding: 20 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  postBtn: {
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  postBtnText: { color: "#0F1117", fontWeight: "700", fontSize: 14 },
  subtitle: { fontSize: 14, color: "#8B8FA8", marginBottom: 24 },
  emptyCard: {
    backgroundColor: "#1C1F26",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  emptyText: { fontSize: 14, color: "#8B8FA8", marginBottom: 24 },
  ctaBtn: {
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaBtnText: { color: "#0F1117", fontWeight: "700", fontSize: 15 },
});

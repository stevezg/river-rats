import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FeedScreen() {
  const { user } = useUser();
  const displayName = user?.firstName ?? user?.emailAddresses[0]?.emailAddress?.split("@")[0] ?? "Paddler";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {displayName} 👋</Text>
            <Text style={styles.subtitle}>Never run a river alone.</Text>
          </View>
          <Link href="/(tabs)/rivers" asChild>
            <TouchableOpacity style={styles.checkFlowsBtn}>
              <Text style={styles.checkFlowsText}>Check Flows</Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {[
            { label: "Post a Trip", emoji: "+", href: "/trips/new" as const },
            { label: "Find Trips", emoji: "🛶", href: "/(tabs)/trips" as const },
            { label: "Rivers", emoji: "🌊", href: "/(tabs)/rivers" as const },
            { label: "Friends", emoji: "🤙", href: "/(tabs)/profile" as const },
          ].map(({ label, emoji, href }) => (
            <Link key={label} href={href} asChild>
              <TouchableOpacity style={styles.quickCard}>
                <Text style={styles.quickEmoji}>{emoji}</Text>
                <Text style={styles.quickLabel}>{label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        {/* Upcoming Trips Placeholder */}
        <Text style={styles.sectionTitle}>Upcoming Trips</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No upcoming trips.</Text>
          <Text style={styles.emptySubtext}>Post a sesh or find one to join.</Text>
        </View>

        {/* Recent Activity Placeholder */}
        <Text style={styles.sectionTitle}>Friend Activity</Text>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Nothing yet.</Text>
          <Text style={styles.emptySubtext}>Add friends to see their river runs.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  scroll: { padding: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 28,
  },
  greeting: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  subtitle: { fontSize: 14, color: "#8B8FA8", marginTop: 2 },
  checkFlowsBtn: {
    backgroundColor: "#4ECDC4",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  checkFlowsText: { color: "#0F1117", fontWeight: "700", fontSize: 14 },
  quickActions: { flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 32 },
  quickCard: {
    width: "47%",
    backgroundColor: "#1C1F26",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    gap: 8,
  },
  quickEmoji: { fontSize: 28 },
  quickLabel: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "#1C1F26",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  emptyText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  emptySubtext: { color: "#8B8FA8", fontSize: 13, marginTop: 4 },
});

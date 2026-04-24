import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useUser, useClerk } from "@clerk/clerk-expo";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    user?.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "Paddler";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  async function handleSignOut() {
    await signOut();
    router.replace("/(auth)/sign-in");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>

        {/* Avatar + Name */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>
          <Text style={styles.email}>{user?.emailAddresses[0]?.emailAddress}</Text>
        </View>

        {/* Paddle Resume (placeholder) */}
        <Text style={styles.sectionTitle}>Paddle Resume</Text>
        <View style={styles.statsRow}>
          {[
            { label: "Rivers Run", value: "0" },
            { label: "Days on Water", value: "0" },
            { label: "Trips Posted", value: "0" },
          ].map(({ label, value }) => (
            <View key={label} style={styles.statCard}>
              <Text style={styles.statValue}>{value}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Settings */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Edit Profile</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Flow Alerts</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuLabel}>Notification Settings</Text>
            <Text style={styles.menuChevron}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  scroll: { padding: 20 },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF", marginBottom: 24 },
  profileCard: { alignItems: "center", marginBottom: 32 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: { fontSize: 26, fontWeight: "700", color: "#0F1117" },
  displayName: { fontSize: 20, fontWeight: "700", color: "#FFFFFF", marginBottom: 4 },
  email: { fontSize: 14, color: "#8B8FA8" },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#FFFFFF", marginBottom: 12 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 32 },
  statCard: {
    flex: 1,
    backgroundColor: "#1C1F26",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  statValue: { fontSize: 24, fontWeight: "700", color: "#4ECDC4" },
  statLabel: { fontSize: 11, color: "#8B8FA8", marginTop: 4, textAlign: "center" },
  menuCard: {
    backgroundColor: "#1C1F26",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  menuLabel: { fontSize: 15, color: "#FFFFFF" },
  menuChevron: { fontSize: 20, color: "#8B8FA8" },
  divider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  signOutBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  signOutText: { color: "#FF6B6B", fontSize: 15, fontWeight: "600" },
});

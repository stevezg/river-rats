import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MessagesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      <View style={styles.empty}>
        <Text style={styles.emptyEmoji}>💬</Text>
        <Text style={styles.emptyTitle}>No messages yet</Text>
        <Text style={styles.emptyText}>
          Join a trip to get added to the crew chat, or start a DM with a friend.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  header: { padding: 20, paddingBottom: 0 },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 40 },
  emptyEmoji: { fontSize: 56, marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#FFFFFF", marginBottom: 8 },
  emptyText: { fontSize: 15, color: "#8B8FA8", textAlign: "center", lineHeight: 22 },
});

import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { riversData } from "@riverrats/shared";

const DIFFICULTY_COLOR: Record<string, string> = {
  "I-II": "#52B788",
  "III": "#FFA94D",
  "III-IV": "#FFA94D",
  "IV": "#FF8C42",
  "IV-V": "#FF8C42",
  "V": "#FF6B6B",
  "V+": "#C62828",
};

export default function RiversScreen() {
  const [query, setQuery] = useState("");

  const filtered = riversData.filter(
    (r) =>
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.state.toLowerCase().includes(query.toLowerCase()) ||
      r.region.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rivers</Text>
        <Text style={styles.subtitle}>{riversData.length} runs with live flow data</Text>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search rivers, states…"
        placeholderTextColor="#5c6070"
        value={query}
        onChangeText={setQuery}
      />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <View
                style={[
                  styles.diffBadge,
                  { backgroundColor: `${DIFFICULTY_COLOR[item.difficulty]}22` },
                ]}
              >
                <Text
                  style={[
                    styles.diffText,
                    { color: DIFFICULTY_COLOR[item.difficulty] },
                  ]}
                >
                  Class {item.difficulty}
                </Text>
              </View>
            </View>
            <Text style={styles.cardRegion}>
              {item.region} · {item.state}
            </Text>
            <Text style={styles.cardOptimal}>
              Optimal: {item.optimalMin.toLocaleString()}–{item.optimalMax.toLocaleString()} CFS
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  header: { paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF" },
  subtitle: { fontSize: 14, color: "#8B8FA8", marginTop: 2 },
  search: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "#1C1F26",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  card: {
    backgroundColor: "#1C1F26",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 },
  cardName: { flex: 1, fontSize: 15, fontWeight: "700", color: "#FFFFFF", marginRight: 8 },
  diffBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  diffText: { fontSize: 12, fontWeight: "700" },
  cardRegion: { fontSize: 13, color: "#8B8FA8", marginBottom: 4 },
  cardOptimal: { fontSize: 12, color: "#5c6070" },
});

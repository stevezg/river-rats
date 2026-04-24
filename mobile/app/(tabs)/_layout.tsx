import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type IconName = keyof typeof Ionicons.glyphMap;

function icon(focused: boolean, name: IconName, outlineName: IconName) {
  return (
    <Ionicons
      name={focused ? name : outlineName}
      size={24}
      color={focused ? "#4ECDC4" : "#8B8FA8"}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1C1F26",
          borderTopColor: "rgba(255,255,255,0.06)",
          paddingBottom: 4,
        },
        tabBarActiveTintColor: "#4ECDC4",
        tabBarInactiveTintColor: "#8B8FA8",
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Feed",
          tabBarIcon: ({ focused }) => icon(focused, "home", "home-outline"),
        }}
      />
      <Tabs.Screen
        name="rivers"
        options={{
          title: "Rivers",
          tabBarIcon: ({ focused }) => icon(focused, "water", "water-outline"),
        }}
      />
      <Tabs.Screen
        name="trips"
        options={{
          title: "Trips",
          tabBarIcon: ({ focused }) => icon(focused, "boat", "boat-outline"),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
          tabBarIcon: ({ focused }) =>
            icon(focused, "chatbubbles", "chatbubbles-outline"),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => icon(focused, "person", "person-outline"),
        }}
      />
    </Tabs>
  );
}

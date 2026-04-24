import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Request permission and return the Expo push token.
// Returns null on simulators or if permission denied.
export async function registerForPushNotifications(): Promise<string | null> {
  if (!Device.isDevice) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    console.warn("[notifications] No EAS projectId found in app.json");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;

  // Android requires a notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "River Rats",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4ECDC4",
    });
    await Notifications.setNotificationChannelAsync("flow-alerts", {
      name: "Flow Alerts",
      description: "Notified when a river enters your optimal CFS window",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4ECDC4",
    });
    await Notifications.setNotificationChannelAsync("trips", {
      name: "Trip Updates",
      description: "Join requests, approvals, and trip crew messages",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return token;
}

// Save push token to the user's profile via API.
export async function savePushToken(token: string, apiBase: string): Promise<void> {
  try {
    await fetch(`${apiBase}/api/profile/push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  } catch (err) {
    console.warn("[notifications] Failed to save push token:", err);
  }
}

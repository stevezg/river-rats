import { useSignIn } from "@clerk/clerk-expo";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Link } from "expo-router";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign in failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🌊</Text>
          </View>
          <Text style={styles.logoText}>River Rats</Text>
        </View>

        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor="#5c6070"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#5c6070"
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#0F1117" />
          ) : (
            <Text style={styles.buttonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Link href="/(auth)/sign-up">
            <Text style={styles.footerLink}>Sign up</Text>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  inner: { flex: 1, justifyContent: "center", paddingHorizontal: 24 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 40 },
  logoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#4ECDC4",
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 20 },
  logoText: { fontSize: 22, fontWeight: "700", color: "#FFFFFF" },
  title: { fontSize: 28, fontWeight: "700", color: "#FFFFFF", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#8B8FA8", marginBottom: 32 },
  error: {
    color: "#FF6B6B",
    fontSize: 13,
    marginBottom: 16,
    padding: 12,
    backgroundColor: "rgba(255,107,107,0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.2)",
  },
  label: { fontSize: 13, fontWeight: "500", color: "#8B8FA8", marginBottom: 6 },
  input: {
    backgroundColor: "#1C1F26",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#4ECDC4",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#0F1117", fontSize: 15, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  footerText: { color: "#8B8FA8", fontSize: 14 },
  footerLink: { color: "#4ECDC4", fontSize: 14, fontWeight: "600" },
});

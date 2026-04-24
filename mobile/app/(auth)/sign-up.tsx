import { useSignUp } from "@clerk/clerk-expo";
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
  ScrollView,
} from "react-native";
import { Link } from "expo-router";

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName: displayName.split(" ")[0],
        lastName: displayName.split(" ").slice(1).join(" ") || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign up failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (!isLoaded) return;
    setError("");
    setLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Verification failed";
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
      <ScrollView contentContainerStyle={styles.inner}>
        <View style={styles.logoRow}>
          <View style={styles.logoIcon}>
            <Text style={styles.logoEmoji}>🌊</Text>
          </View>
          <Text style={styles.logoText}>River Rats</Text>
        </View>

        {pendingVerification ? (
          <>
            <Text style={styles.title}>Check your email</Text>
            <Text style={styles.subtitle}>
              We sent a verification code to {email}
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              placeholderTextColor="#5c6070"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              textContentType="oneTimeCode"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F1117" />
              ) : (
                <Text style={styles.buttonText}>Verify Email</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.title}>Join River Rats</Text>
            <Text style={styles.subtitle}>
              Find paddling partners at your skill level
            </Text>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <Text style={styles.label}>Your name</Text>
            <TextInput
              style={styles.input}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="River Runner"
              placeholderTextColor="#5c6070"
              autoComplete="name"
              textContentType="name"
            />

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
              placeholder="Minimum 8 characters"
              placeholderTextColor="#5c6070"
              secureTextEntry
              autoComplete="new-password"
              textContentType="newPassword"
            />

            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#0F1117" />
              ) : (
                <Text style={styles.buttonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Link href="/(auth)/sign-in">
                <Text style={styles.footerLink}>Sign in</Text>
              </Link>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F1117" },
  inner: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24, paddingVertical: 40 },
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

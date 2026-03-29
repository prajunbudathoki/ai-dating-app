import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyboardAreaView } from "@/components/ui/keyboard-area-view";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
    
const SignIn = () => {
  const { signIn, isLoaded, setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const onSigninPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signIn.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(app)");
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAreaView contentContainerStyle={styles.scrollContent}>
        <Animated.View
          entering={FadeInDown.delay(200).duration(1000)}
          style={styles.header}
        >
          <ThemedText type="title" style={styles.title}>
            Welcome Back
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            Sign in to continue your journey
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(1000)}
          style={styles.formContainer}
        >
          <Input
            placeholder="Email Address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            autoCapitalize="none"
            keyboardType="email-address"
            icon="mail-outline"
            style={styles.input}
          />
          <Input
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon="lock-closed-outline"
            style={styles.input}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Sign In"
            onPress={onSigninPress}
            loading={loading}
            style={styles.button}
          />

          <View style={styles.footer}>
            <Text style={{ color: "#6B7280" }}>Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <Text style={styles.link}>Sign Up</Text>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  button: {
    marginTop: 24,
  },
  input: {
    color: "#000000",
  },
  errorText: {
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  link: {
    color: "#FF4B6E",
    fontWeight: "700",
  },
});

export default SignIn;

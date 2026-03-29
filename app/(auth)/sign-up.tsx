import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyboardAreaView } from "@/components/ui/keyboard-area-view";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [pendingVerfication, setPendingVerfication] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerfication(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    setError("");
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace("/(app)");
      } else {
        setError("Verification failed. Please check the code.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid code.");
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
            {pendingVerfication ? "Verify Email" : "Create Account"}
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {pendingVerfication
              ? "We've sent a code to your email"
              : "Join the community and find your match"}
          </ThemedText>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(400).duration(1000)}
          style={styles.formContainer}
        >
          {pendingVerfication ? (
            <>
              <Input
                label="Verification Code"
                placeholder="Enter the 6-digit code"
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                icon="mail-open-outline"
              />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Button
                title="Verify"
                onPress={onVerifyPress}
                loading={loading}
                style={styles.button}
              />
              <Button
                title="Back to Sign Up"
                variant="outline"
                onPress={() => setPendingVerfication(false)}
                style={{ marginTop: 12 }}
              />
            </>
          ) : (
            <>
              <Input
                label="Email Address"
                placeholder="Enter your email"
                value={emailAddress}
                onChangeText={setEmailAddress}
                autoCapitalize="none"
                keyboardType="email-address"
                icon="mail-outline"
              />
              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon="lock-closed-outline"
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <Button
                title="Get Started"
                onPress={onSignUpPress}
                loading={loading}
                style={styles.button}
              />

              <View style={styles.footer}>
                <ThemedText>Already have an account? </ThemedText>
                <Link href="/sign-in" asChild>
                  <Text style={styles.link}>Sign In</Text>
                </Link>
              </View>
            </>
          )}
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

export default SignUp;

import { ThemedText } from "@/components/themed-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp, isLoaded, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerfication, setPendingVerfication] = useState(false);
  const [code, setCode] = useState("");

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
      console.error(JSON.stringify(err, null, 2));
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
      console.error(JSON.stringify(err, null, 2));
      setError(err.errors?.[0]?.message || "Invalid code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/auth-bg.png")}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <ThemedText type="title" style={styles.title}>
                {pendingVerfication ? "Verify Email" : "Create Account"}
              </ThemedText>
              <ThemedText style={styles.subtitle}>
                {pendingVerfication
                  ? "We've sent a code to your email"
                  : "Join the community and find your match"}
              </ThemedText>
            </View>

            <View style={styles.formContainer}>
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
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    color: "#11181C",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#687076",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  button: {
    marginTop: 16,
  },
  errorText: {
    color: "#FF4B6E",
    marginBottom: 16,
    textAlign: "center",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  link: {
    color: "#FF4B6E",
    fontWeight: "bold",
  },
});

export default SignUp;

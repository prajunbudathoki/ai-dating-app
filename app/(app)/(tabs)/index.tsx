import { Button } from "@/components/ui/button";
import { router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Text>home</Text>
      <Button title="Sign in" onPress={() => router.push("/(auth)/sign-in")} />
    </SafeAreaView>
  );
}

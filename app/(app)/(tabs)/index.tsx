import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { isLoaded, isSignedIn, userId, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  if (!isSignedIn) {
    router.replace("/(auth)/sign-in");
  }
  return (
    <SafeAreaView>
      <Text>home</Text>
      <Text>{isSignedIn.valueOf()}</Text>
      <Text>{userId}</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </SafeAreaView>
  );
}

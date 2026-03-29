import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignIn = () => {
  const { signIn,isLoaded,setActive } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSigninPress = async () => {
    if(!isLoaded) return
    try{
        const signInAttempt = await signIn.create({
            identifier: emailAddress,
            password
        })
        if(signIn.status === 'complete'){
            await setActive({ session: signInAttempt.createdSessionId })
            router.replace('/(app)')
        }else{
            console.error(JSON.stringify(signInAttempt,null,2))
        }
    }catch(err){
        console.error(JSON.stringify(err,null,2))
    }
  }

  return (
    <SafeAreaView>
      <Text>Sign In</Text>
      <TextInput
        placeholder="Email"
        value={emailAddress}
        onChangeText={setEmailAddress}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={onSigninPress} disabled={loading}>
        <Text>Continue</Text>
      </TouchableOpacity>
      <Link href="/sign-up">Sign Up</Link>
    </SafeAreaView>
  );
};

export default SignIn;
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SignUp = () => {
  const { signUp,isLoaded,setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingVerfication,setPendingVerfication] = useState(false)
  const [code,setCode] = useState("")
  const onSigninPress = async () => {
    if(!isLoaded) return
    try{
        const signUpAttempt = await signUp.create({
            emailAddress,
            password
        })
        await signUp.prepareEmailAddressVerification({strategy: 'email_code'})
        setPendingVerfication(true)
    }catch(err){
        console.error(JSON.stringify(err,null,2))
    }
  }

  const onVerifyPress = async () => {
    if(!isLoaded) return
    try{
        const completeSignUp = await signUp.attemptEmailAddressVerification({code})
        if(completeSignUp.status === 'complete'){
            await setActive({ session: completeSignUp.createdSessionId })
            router.replace('/(app)')
        }
    }catch(err){
        console.error(JSON.stringify(err,null,2))
    }
  }

  return (
    <SafeAreaView>
      <Text>Sign up</Text>
      {pendingVerfication ? (
        <>
        <TextInput
        placeholder="Code"
        value={code}
        onChangeText={setCode}
      />
      <TouchableOpacity onPress={onVerifyPress} disabled={loading}>
        <Text>Verify</Text>
      </TouchableOpacity>
        </>
      ) : (
        <>
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
        </>
      )}
    </SafeAreaView>
  );
};

export default SignUp;
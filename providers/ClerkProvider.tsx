import {tokenCache} from "@/lib/auth";
import {ClerkLoaded,ClerkProvider as ClerkProviderBase} from "@clerk/clerk-expo";
import {ActivityIndicator,View} from "react-native";

const clerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if(!clerkPublishableKey) {
    throw new Error("Missing Clerk Publishable Key");
}

interface ClerkProviderProps {
    children: React.ReactNode
}

const ClerkProvider = ({children}: ClerkProviderProps) => {
    return (
        <ClerkProviderBase
        tokenCache={tokenCache}
        publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
        >
            <ClerkLoaded>{children}</ClerkLoaded>
        </ClerkProviderBase>
    )
}

export default ClerkProvider;
import React from "react";
import { Text, View } from "react-native";
import ClerkProvider from "./ClerkProvider";

interface AppProvider {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProvider) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default AppProvider;

import React from "react";
import { useFonts } from "expo-font";
import { QueryClient, QueryClientProvider } from "react-query";
import { extendTheme, NativeBaseProvider } from "native-base";
import Container from "./Container";
import { UserContextProvider } from "./context/UserContext";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {

  const [fontsLoaded] = useFonts({
    AvenirLTStdBlack: require("./assets/fonts/AvenirBlack.otf"),
    AvenirLTStdBook: require("./assets/fonts/AvenirBook.otf"),
  });

  const config = {
    useSystemColorMode: false,
    initialColorMode: "light",
  };

  const fontConfig = {
    AvenirLTStd: {
      400: {
        normal: "AvenirLTStdBook",
        bold: "AvenirLTStdBlack",
      },
    },
  };


  const theme = extendTheme({
    config,
    fontConfig,
    fonts: {
      heading: "AvenirLTStdBlack",
      body: "AvenirLTStdBook",
      mono: "AvenirLTStdBook",
    },
  });

  if (!fontsLoaded) {
    return <></>;
  }

  const client = new QueryClient();

  return (
    <NavigationContainer>
      <QueryClientProvider client={client}>
        <NativeBaseProvider theme={theme}>
          <UserContextProvider>
            <Container />
          </UserContextProvider>
        </NativeBaseProvider>
      </QueryClientProvider>
    </NavigationContainer>
  );
}

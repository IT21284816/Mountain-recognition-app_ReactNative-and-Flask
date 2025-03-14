import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from 'react-native';
import ImagePickerExample from "./components/ImageRecognize/ImagePicker";
import LiveCamera from "./components/camera/LiveCamera";
import Home from "./components/Home/home";
import SplashScreen from "./components/Splash/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show splash screen for 2 seconds
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#fff',
            headerLeftContainerStyle: {
              paddingLeft: 20,
            },
            headerStyle: {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="ImagePicker" component={ImagePickerExample} />
          <Stack.Screen name="LiveCamera" component={LiveCamera} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

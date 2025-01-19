import { SafeAreaView, Text, View, Image, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router,Link } from "expo-router";
import React, { useState, useEffect } from "react";
import icons from "../constants/icons";
import CustomButton from "../components/CustomButton";

export default function Index() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-4">
           {/* Add the greeting here */}
           <Text className="text-5xl font-pbital text-center text-white">
              {greeting}! 
            </Text>
            <Text className="text-xl font-pbold text-center text-white">
               Welcome to
            </Text>
          <Image
            source={icons.logo}
            style={{ width: 300, height: 200 }}
            tintColor={"#fff"}
            resizeMode="contain"
            accessibilityLabel="Camera Icon"
          />

          <View className="mt-5">
           
            <Text className="text-3xl font-pbold text-center">
              <Text className="text-secondary">QR & Bar Pro</Text>
              {"\n"}
              <Text className="text-white text-xl">advanced QRCode & Barcode scanner and generator mobile app</Text>
              
            </Text>
            
          </View>

          <CustomButton
            title="Explore the app"
            handlePress={() => router.push("/home")}
            containerStyles="mt-7 w-full"
          />
        </View>
        <Text className="text-sm font-pregular mt-7 text-center pb-4 text-white">
              Powered by Buda Technologies
            </Text>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

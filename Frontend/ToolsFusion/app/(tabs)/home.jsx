import React from "react";
import { View, Text, Image, SafeAreaView, ScrollView } from "react-native";
import { router } from "expo-router";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";

const Home = () => {
  const actions = [
    { title: "Scan QR Code", route: "/(tabs)/scan" },
    { title: "Scan Barcode", route: "scan/index" },
    { title: "Generate QR Code", route: "/(tabs)/generate" },
    { title: "Generate Barcode", route: "/(tabs)/generate" },
  ];

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-evenly", padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Image
            source={icons.logo}
            style={{ width: 300, height: 200 }}
            tintColor={"#fff"}
            resizeMode="contain"
            alt="App Logo"
          />
          <Text className="text-secondary text-3xl font-pbold mt-2 text-center">
            QR & Bar Pro
          </Text>
        </View>

        {/* Main Actions */}
        <View>
          {actions.map((action, index) => (
            <CustomButton
              key={index}
              title={action.title}
              handlePress={() => router.push(action.route)}
              containerStyles="bg-secondary mb-3"
              textStyles="text-primary"
            />
          ))}
        </View>

        {/* Info Section */}
        <View className="mt-10">
          <Text className="text-white text-center text-lg font-plight">
            Simplify your daily tasks with our advanced QR and Barcode tools.
          </Text>
        </View>

        {/* Footer */}
        <View className="items-center mt-auto mb-4">
          <Text className="text-white text-xs font-plight">
            Powered by Buda Technologies
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

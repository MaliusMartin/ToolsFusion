import React from "react";
import { SafeAreaView, Text, View, Image, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import * as Updates from "expo-updates"; // For app updates
import CustomButton from "../../components/CustomButton";
import images from "../../constants/images";

const Settings = () => {
  const appVersion = Updates.manifest?.version || "1.0.0"; // Default to "1.0.0" if no version is available

  const handleAppUpdate = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        Alert.alert(
          "Update Available",
          "The app will now restart to apply the update.",
          [{ text: "OK", onPress: () => Updates.reloadAsync() }]
        );
      } else {
        Alert.alert("Up-to-date", "You are using the latest version of the app.");
      }
    } catch (error) {
      console.error("Error checking for updates:", error);
      Alert.alert("Error", "Unable to check for updates. Please try again later.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar style="light" />
      <ScrollView className="p-5">
        {/* Header */}
        <View className="items-center mb-5">
          <Image source={images.appLogo} className="w-24 h-24" resizeMode="contain" />
          <Text className="text-2xl font-pbold mt-2 text-white">Settings</Text>
        </View>

        {/* General Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">General</Text>
          <CustomButton
            title="Scan History"
            onPress={() => router.push("/scan-history")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Generated Codes"
            onPress={() => router.push("/generated-codes")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Clear Data"
            onPress={() => Alert.alert("Clear Data", "All data cleared successfully!")}
            containerStyles="bg-secondary"
          />
        </View>

        {/* Preferences Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Preferences</Text>
          <CustomButton
            title="Theme"
            onPress={() => router.push("/settings/theme")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Sound Settings"
            onPress={() => router.push("/settings/sound")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Vibration Settings"
            onPress={() => router.push("/settings/vibration")}
            containerStyles="bg-secondary"
          />
        </View>

        {/* Account Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Account</Text>
          <CustomButton
            title="Login / Logout"
            onPress={() => router.push("/auth")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Privacy Policy"
            onPress={() => router.push("/privacy-policy")}
            containerStyles="bg-secondary"
          />
        </View>

        {/* Support Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Support</Text>
          <CustomButton
            title="Help & FAQs"
            onPress={() => router.push("/help")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Contact Us"
            onPress={() => router.push("/contact")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Submit Feedback"
            onPress={() => Alert.alert("Feedback", "Thank you for your feedback!")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title="Rate App"
            onPress={() => router.push("/rate")}
            containerStyles="bg-secondary"
          />
        </View>

        {/* About Section */}
        <View>
          <Text className="text-lg font-psemibold mb-2 text-white">About</Text>
          <CustomButton
            title="About App"
            onPress={() => router.push("/about")}
            containerStyles="mb-2 bg-secondary"
          />
          <CustomButton
            title={`Version: v${appVersion}`}
            onPress={handleAppUpdate}
            containerStyles="bg-secondary"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

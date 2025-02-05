import React from "react";
import { SafeAreaView, Text, View, Image, ScrollView, Alert } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import * as Updates from "expo-updates"; // For app updates
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";

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
      <ScrollView className="px-4 pt-2">
        {/* Header */}
       {/* Header */}
       <View className="items-center mb-8 mt-12">
          <View className="bg-white/10 p-4 rounded-full mb-3">
            <Image 
              source={icons.settings} 
              // className="w-10 h-10" 
              style={{ width: 40, height: 40 }}
              resizeMode="contain" 
              tintColor={"#fff"}
            />
          </View>
          <Text className="text-3xl font-pbold text-white">Settings</Text>
          <View className="w-16 h-1 bg-secondary rounded-full mt-2" />
        </View>

        {/* General Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">General</Text>
          <Link href="/(set)/scanhistory/">
            <CustomButton title="Scan History" containerStyles="mb-2 bg-secondary" />
          </Link>
          <Link href="/(set)/generatedcodes">
            <CustomButton title="Generated Codes" containerStyles="mb-2 bg-secondary" />
          </Link>
          <CustomButton
            title="Clear Data"
            onPress={() => Alert.alert("Clear Data", "All data cleared successfully!")}
            containerStyles="bg-secondary"
          />
        </View>

        {/* Preferences Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Preferences</Text>
          <Link href="/settings/theme">
            <CustomButton title="Theme" containerStyles="mb-2 bg-secondary" />
          </Link>
          <Link href="/settings/sound">
            <CustomButton title="Sound Settings" containerStyles="mb-2 bg-secondary" />
          </Link>
          <Link href="/settings/vibration">
            <CustomButton title="Vibration Settings" containerStyles="bg-secondary" />
          </Link>
        </View>

        {/* Account Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Account</Text>
          <Link href="/auth">
            <CustomButton title="Login / Logout" containerStyles="mb-2 bg-secondary" />
          </Link>
          <Link href="/privacy-policy">
            <CustomButton title="Privacy Policy" containerStyles="bg-secondary" />
          </Link>
        </View>

        {/* Support Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-2 text-white">Support</Text>
          <Link href="/help">
            <CustomButton title="Help & FAQs" containerStyles="mb-2 bg-secondary" />
          </Link>
          <Link href="/contact">
            <CustomButton title="Contact Us" containerStyles="mb-2 bg-secondary" />
          </Link>
          <CustomButton
            title="Submit Feedback"
            onPress={() => Alert.alert("Feedback", "Thank you for your feedback!")}
            containerStyles="mb-2 bg-secondary"
          />
          <Link href="/rate">
            <CustomButton title="Rate App" containerStyles="bg-secondary" />
          </Link>
        </View>

        {/* About Section */}
        <View>
          <Text className="text-lg font-psemibold mb-2 text-white">About</Text>
          <Link href="/about">
            <CustomButton title="About App" containerStyles="mb-2 bg-secondary" />
          </Link>
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

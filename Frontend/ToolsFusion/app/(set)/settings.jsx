import React from "react";
import { SafeAreaView, Text, View, Image, ScrollView, Alert, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Link } from "expo-router";
import * as Updates from "expo-updates"; // For app updates
import icons from "../../constants/icons";

const SettingsItem = ({ icon, label, onPress, href }) => {
  const content = (
    <View className="flex-row items-center bg-secondary p-4 rounded-lg mb-3">
      <Image source={icon} style={{ width: 24, height: 24, tintColor: "#fff", marginRight: 10 }} />
      <Text className="text-white font-pregular">{label}</Text>
    </View>
  );

  return href ? (
    <Link href={href} asChild>
      <TouchableOpacity>{content}</TouchableOpacity>
    </Link>
  ) : (
    <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>
  );
};

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
        <View className="items-center mb-8 mt-12">
          <View className="bg-white/10 p-4 rounded-full mb-3">
            <Image
              source={icons.settings}
              style={{ width: 40, height: 40 }}
              resizeMode="contain"
              tintColor={"#fff"}
            />
          </View>
          <Text className="text-3xl font-pbold text-white">Settings</Text>
          <View className="w-16 h-1 bg-secondary rounded-full mt-2" />
        </View>

        {/* Preferences Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-4 text-white">Preferences</Text>
          <SettingsItem icon={icons.theme} label="Theme" href="/settings/theme" />
          <SettingsItem icon={icons.sound} label="Sound Settings" href="/settings/sound" />
          <SettingsItem icon={icons.vibration} label="Vibration Settings" href="/settings/vibration" />
        </View>

        {/* Privacy Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-4 text-white">Privacy</Text>
          <SettingsItem icon={icons.privacy} label="Privacy Policy" href="/privacy-policy" />
        </View>

        {/* Support Section */}
        <View className="mb-5">
          <Text className="text-lg font-psemibold mb-4 text-white">Support</Text>
          <SettingsItem icon={icons.help} label="Help & FAQs" href="/help" />
          <SettingsItem icon={icons.contact} label="Contact Us" href="/contact" />
          <SettingsItem
            icon={icons.feedback}
            label="Submit Feedback"
            onPress={() => Alert.alert("Feedback", "Thank you for your feedback!")}
          />
          <SettingsItem icon={icons.rate} label="Rate App" href="/rate" />
        </View>

        {/* About Section */}
        <View>
          <Text className="text-lg font-psemibold mb-4 text-white">About</Text>
          <SettingsItem icon={icons.about} label="About App" href="/about" />
          <SettingsItem
            icon={icons.update}
            label={`Version: v${appVersion}`}
            onPress={handleAppUpdate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

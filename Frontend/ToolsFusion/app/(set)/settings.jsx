import React from "react";
import { SafeAreaView, Text, View, ScrollView, Switch, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import icons from "../../constants/icons";
import CustomButton from "../../components/CustomButton";

const settings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);

  const toggleNotifications = () => setNotificationsEnabled((prevState) => !prevState);

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-3xl font-pbold text-white mb-5">Settings</Text>

        {/* User Preferences Section */}
        <View className="bg-secondary p-4 rounded-lg mb-4">
          <Text className="text-lg font-psemibold text-white mb-3">User Preferences</Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-white">Enable Notifications</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
              onValueChange={toggleNotifications}
              value={notificationsEnabled}
            />
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-white">Dark Mode</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={"#f4f3f4"}
              value={true} // Dark mode enabled by default
              disabled
            />
          </View>
        </View>

        {/* App Features Section */}
        <View className="bg-secondary p-4 rounded-lg mb-4">
          <Text className="text-lg font-psemibold text-white mb-3">App Features</Text>
          <TouchableOpacity
            className="p-3 bg-primary rounded-md mb-3"
            onPress={() => router.push("/scan")}
          >
            <Text className="text-white">Open Scanner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 bg-primary rounded-md mb-3"
            onPress={() => router.push("/generate")}
          >
            <Text className="text-white">QR & Barcode Generator</Text>
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View className="bg-secondary p-4 rounded-lg mb-4">
          <Text className="text-lg font-psemibold text-white mb-3">Support</Text>
          <TouchableOpacity
            className="p-3 bg-primary rounded-md mb-3"
            onPress={() => router.push("/about")}
          >
            <Text className="text-white">About Us</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 bg-primary rounded-md mb-3"
            onPress={() => router.push("/help")}
          >
            <Text className="text-white">Help & FAQs</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <CustomButton
          title="Logout"
          handlePress={() => router.replace("/")}
          containerStyles="mt-5 bg-red-600"
          textStyles="text-white"
        />
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default settings;

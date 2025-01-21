import { View, Text } from "react-native";
import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import CustomButton from "../../components/CustomButton";
import { Link } from "expo-router"; // Import Link from expo-router

const More = () => {
  const actions = [
    { title: "Scan QR Code", route: "/(tabs)/scan" },
    { title: "Scan Barcode", route: "/(scan)/uploaded" },
    { title: "Generate QR Code", route: "/(tabs)/generate" },
    { title: "Generate Barcode", route: "/(generate)/gindex" },
  ];

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-evenly",
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Actions */}
        <View>
          {actions.map((action, index) => (
            <Link key={index} href={action.route} style={{ textDecoration: "none" }}>
              <CustomButton
                title={action.title}
                containerStyles="bg-secondary mb-3"
                textStyles="text-primary"
              />
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default More;

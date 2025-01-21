import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";
import CustomButton from "../../components/CustomButton";

const GeneratedCodes = () => {
  const [generatedCodes, setGeneratedCodes] = useState([
    { id: "1", data: "https://example.com/qr1", type: "QR Code" },
    { id: "2", data: "https://example.com/qr2", type: "QR Code" },
    { id: "3", data: "https://example.com/barcode1", type: "Barcode" },
  ]);

  const handleAction = async (action, item) => {
    switch (action) {
      case "copy":
        try {
          await Clipboard.setStringAsync(item.data);
          Alert.alert("Copied", "Text copied to clipboard.");
        } catch (error) {
          Alert.alert("Error", "Failed to copy text.");
        }
        break;

      case "share":
        try {
          const result = await Share.share({
            message: item.data,
          });

          if (result.action === Share.sharedAction) {
            Alert.alert("Success", "Data shared successfully.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to share the data.");
        }
        break;

      case "delete":
        setGeneratedCodes(generatedCodes.filter((code) => code.id !== item.id));
        Alert.alert("Deleted", "Generated code has been deleted.");
        break;

      default:
        Alert.alert("Error", "Invalid action.");
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-secondary p-4 mb-4 rounded-lg">
      <Text className="text-white text-lg font-pmedium">{item.data}</Text>
      <Text className="text-white text-sm font-plight mb-2">{item.type}</Text>
      <View className="flex-row justify-between mt-4">
        <CustomButton
          title="Copy"
          handlePress={() => handleAction("copy", item)}
          containerStyles="bg-primary w-[30%]"
          textStyles="text-white"
        />
        <CustomButton
          title="Share"
          handlePress={() => handleAction("share", item)}
          containerStyles="bg-primary w-[30%]"
          textStyles="text-white"
        />
        <CustomButton
          title="Delete"
          handlePress={() => handleAction("delete", item)}
          containerStyles="bg-red-500 w-[30%]"
          textStyles="text-white"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <Text className="text-white text-xl font-pbold mb-4">Generated Codes</Text>

      {generatedCodes.length > 0 ? (
        <FlatList
          data={generatedCodes}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      ) : (
        <Text className="text-white text-center mt-8">
          No generated codes available.
        </Text>
      )}

      {/* Footer */}
      <View className="items-center mt-auto mb-4">
        <Text className="text-white text-xs font-plight">Powered by Buda Technologies</Text>
      </View>
    </SafeAreaView>
  );
};

export default GeneratedCodes;

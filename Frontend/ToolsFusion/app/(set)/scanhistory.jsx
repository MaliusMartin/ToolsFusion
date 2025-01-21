import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";

const ScanHistory = () => {
  const [history, setHistory] = useState([]);

  // Fetch scan history from AsyncStorage
  const fetchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("scanHistory");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Clear all scan history
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("scanHistory");
      setHistory([]);
      Alert.alert("Success", "Scan history cleared.");
    } catch (error) {
      console.error("Error clearing history:", error);
      Alert.alert("Error", "Failed to clear history.");
    }
  };

  // Run fetchHistory on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  // Render each scan item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="bg-secondary p-4 mb-2 rounded-lg"
      onPress={() => Alert.alert("Scan Data", item.data)}
    >
      <Text className="text-primary font-bold">Type: {item.type}</Text>
      <Text className="text-white mt-2">Data: {item.data}</Text>
      <Text className="text-gray-400 mt-2">Scanned At: {item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary p-4 ">
     
     <View className=" ">
     <Text className="text-white text-xl font-pbold mt-12 text-center">Scan History</Text>
     </View>
     
      {history.length > 0 ? (
        <FlatList
          data={history}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          className="mb-4"
        />
      ) : (
        <Text className="text-white text-center mt-4">No scan history available.</Text>
      )}

      <CustomButton
        title="Clear History"
        handlePress={clearHistory}
        containerStyles="bg-red-600 mt-auto"
        textStyles="text-white"
      />

      {/* Footer */}
      <View className="items-center mt-4">
        <Text className="text-white text-xs">Powered by Buda Technologies</Text>
      </View>
     
    </SafeAreaView>
  );
};

export default ScanHistory;

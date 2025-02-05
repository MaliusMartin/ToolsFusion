import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
  RefreshControl,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import * as Clipboard from "expo-clipboard";
import { Share } from "react-native";

const History = () => {
  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch history from AsyncStorage
  const fetchHistory = async () => {
    try {
      const storedHistory = await AsyncStorage.getItem("history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // Clear all history
  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem("history");
      setHistory([]);
      Alert.alert("Success", "History cleared.");
    } catch (error) {
      console.error("Error clearing history:", error);
      Alert.alert("Error", "Failed to clear history.");
    }
  };

  // Clear individual history item
  const clearIndividualItem = async (index) => {
    try {
      const updatedHistory = [...history];
      updatedHistory.splice(index, 1);
      await AsyncStorage.setItem("history", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
      Alert.alert("Success", "Activity deleted.");
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete activity. Please try again.");
    }
  };

  // Handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  // Share data
  const handleShare = async (data) => {
    try {
      await Share.share({
        message: data,
        title: "Share QR Code or Barcode Data",
      });
    } catch (error) {
      console.error("Error sharing link:", error);
      Alert.alert("Error", "Failed to share the link. Please try again.");
    }
  };

  // Copy data to clipboard
  const handleCopy = async (data) => {
    try {
      await Clipboard.setStringAsync(data);
      Alert.alert("Success", "Data copied to clipboard.");
    } catch (error) {
      console.error("Failed to copy:", error);
      Alert.alert("Error", "Failed to copy data. Please try again.");
    }
  };

  // Search data online
  const handleSearch = async (data) => {
    try {
      await Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(data)}`);
    } catch (err) {
      console.error("Failed to open URL:", err);
      Alert.alert("Error", "Failed to search online. Please try again.");
    }
  };

  // Render each history item
  const renderItem = ({ item, index }) => (
    <View className="bg-secondary p-4 mb-2 rounded-lg">
      <Text className="text-primary font-pbold">Type: {item.type}</Text>
      {item.barcodeType && (
        <Text className="text-white mt-2 font-pregular">
          Barcode Type: {item.barcodeType}
        </Text>
      )}
      <Text className="text-white mt-2 font-psemibold">Data: {item.data}</Text>
      <Text className="text-white-400 mt-2 font-pregular">
        Timestamp: {item.timestamp}
      </Text>

      {/* Action Buttons */}
      <View className="flex-row mt-4 justify-between">
        {/* Copy Button */}
        <TouchableOpacity onPress={() => handleCopy(item.data)}>
          <Image source={icons.copy} style={{ width: 24, height: 24, tintColor: "white" }} />
        </TouchableOpacity>

        {/* Share Button */}
        <TouchableOpacity onPress={() => handleShare(item.data)}>
          <Image source={icons.share} style={{ width: 24, height: 24, tintColor: "white" }} />
        </TouchableOpacity>

        {/* Search Button */}
        <TouchableOpacity onPress={() => handleSearch(item.data)}>
          <Image source={icons.search} style={{ width: 24, height: 24, tintColor: "white" }} />
        </TouchableOpacity>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => clearIndividualItem(index)}>
          <Image source={icons.delet} style={{ width: 24, height: 24, tintColor: "red" }} />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Run fetchHistory on mount
  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primary p-4">
      <View className="items-center mb-8 mt-10">
        <Text className="text-2xl font-pbold text-center text-white mb-2 mt-2">
          History
        </Text>
        <Image
          source={icons.pedometer}
          style={{ width: 40, height: 40 }}
          className="mt-4"
          tintColor={"#fff"}
          resizeMode="contain"
        />
      </View>

      {/* Use FlatList for scrolling and refreshing */}
      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={
          <Text className="text-white text-center mt-4">
            No history available. Refresh
          </Text>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* Clear History Button */}
      <CustomButton
        title="Clear History"
        handlePress={clearHistory}
        containerStyles="bg-red-600 mt-4"
        textStyles="text-white"
      />

      {/* Footer */}
      <View className="items-center mt-auto mb-2">
        <Text className="text-secondary text-sm font-pbold mt-2 text-center">
          QR & Bar Pro
        </Text>
        <Text className="text-white text-sm font-plight">
          Powered by Buda Technologies
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default History;

import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Clipboard from "expo-clipboard";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Linking from "expo-linking";
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import { Share } from "react-native";
import icons from "../../constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UploadedScan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Function to save scan history to AsyncStorage
  const saveGenerationHistory = async (data, type) => {
    try {
      const historyItem = {
        type: type, // "QR Code" or "Barcode"
        data: data, // Scanned data
        timestamp: new Date().toLocaleString(), // Current timestamp
      };

      // Fetch existing history from AsyncStorage
      const storedHistory = await AsyncStorage.getItem("history");
      const history = storedHistory ? JSON.parse(storedHistory) : [];

      // Add the new item to the beginning of the history array
      history.unshift(historyItem);

      // Save the updated history back to AsyncStorage
      await AsyncStorage.setItem("history", JSON.stringify(history));
    } catch (error) {
      console.error("Error saving scan history:", error);
      Alert.alert("Error", "Failed to save scan history.");
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission required", "You need to grant permission to access the gallery.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleScanImage = async () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image to scan.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: selectedImage,
        name: `image-${Date.now()}.jpg`,
        type: "image/jpeg",
      });

      const response = await axios.post("https://toolsfusion.onrender.com/scan/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const { qr_code, barcode } = response.data.results;
        const scannedData = qr_code || barcode || null;

        if (scannedData) {
          setScanResult(scannedData);
          setModalVisible(true);

          // Save the scan result to AsyncStorage
          const barcodeType = qr_code ? "QR Code" : "Barcode";
          await saveGenerationHistory(scannedData.data, barcodeType);
        } else {
          Alert.alert("Error", "No valid QR Code or Barcode found.");
        }
      } else {
        Alert.alert("Error", "No valid QR Code or Barcode found.");
      }
    } catch (error) {
      console.error("Error scanning image:", error);
      Alert.alert("Error", "Failed to scan the image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAction = async (action) => {
    if (!scanResult?.data) return;

    const data = scanResult.data;

    switch (action) {
      case "open":
        try {
          await Linking.openURL(data);
        } catch (err) {
          Alert.alert("Error", "Failed to open the URL.");
        }
        break;

      case "copy":
        try {
          await Clipboard.setStringAsync(data);
          Alert.alert("Copied", "Text copied to clipboard.");
        } catch (error) {
          Alert.alert("Error", "Failed to copy text.");
        }
        break;

      case "share":
        try {
          const result = await Share.share({
            message: `Here's the link: ${data}`,
          });

          if (result.action === Share.sharedAction) {
            Alert.alert("Success", "Link shared successfully.");
          }
        } catch (error) {
          Alert.alert("Error", "Failed to share the link.");
        }
        break;

      case "search":
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(data)}`;
        try {
          await Linking.openURL(searchUrl);
        } catch (error) {
          Alert.alert("Error", "Failed to open the search.");
        }
        break;

      default:
        Alert.alert("Error", "Invalid action.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary items-center justify-center p-4">
      <View className="mt-12">
        <View className="items-center justify-center">
          <Text className="text-2xl font-pbold text-center text-white mb-2 mt-2">
            Local storage
          </Text>
          <TouchableOpacity onPress={pickImage} className="mb-6">
            <Image
              source={icons.gallery}
              style={{ width: 80, height: 80 }}
              className="mt-4"
              tintColor={"#fff"}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 200, height: 200, marginVertical: 20 }}
            resizeMode="contain"
          />
        )}

        <CustomButton
          title="Scan Image"
          handlePress={handleScanImage}
          containerStyles="bg-secondary"
          textStyles="text-primary"
          isLoading={isUploading}
        />
      </View>

      {/* Modal for Scan Result */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50"
         style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <View className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <Text className="text-black text-xl font-pbold mb-4 text-center">
              Scan Result
            </Text>

            {scanResult?.data ? (
              <>
                <ScrollView className="max-h-40 mb-4">
                  <Text className="text-black text-base font-pregular">
                    {scanResult.data}
                  </Text>
                </ScrollView>

                <View className="flex-row flex-wrap justify-between gap-4">
                  <TouchableOpacity
                    className="flex-1 items-center p-3 bg-secondary rounded-lg"
                    onPress={() => handleAction("open")}
                  >
                    <Image
                      source={icons.link}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                      tintColor="#fff"
                    />
                    <Text className="text-white font-pregular mt-2 text-sm">Open</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 items-center p-3 bg-secondary rounded-lg"
                    onPress={() => handleAction("copy")}
                  >
                    <Image
                      source={icons.copy}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                      tintColor="#fff"
                    />
                    <Text className="text-white font-pregular mt-2 text-sm">Copy</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 items-center p-3 bg-secondary rounded-lg"
                    onPress={() => handleAction("share")}
                  >
                    <Image
                      source={icons.share}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                      tintColor="#fff"
                    />
                    <Text className="text-white text-sm font-pregular mt-2">Share</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 items-center p-3 bg-secondary rounded-lg"
                    onPress={() => handleAction("search")}
                  >
                    <Image
                      source={icons.search}
                      style={{ width: 24, height: 24 }}
                      resizeMode="contain"
                      tintColor="#fff"
                    />
                    <Text className="text-white font-pregular mt-2 text-sm">Search</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text className="text-black text-center font-pregular">
                No QR Code or Barcode found.
              </Text>
            )}

            <CustomButton
              title="Close"
              handlePress={() => setModalVisible(false)}
              textStyles="text-white"
            />
          </View>
          
        </View>
      </Modal>

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

export default UploadedScan;
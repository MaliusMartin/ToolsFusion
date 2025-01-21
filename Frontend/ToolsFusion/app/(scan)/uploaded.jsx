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
import { Link } from "expo-router";

const UploadedScan = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [scanResult, setScanResult] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);



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
        setScanResult(qr_code || barcode || null);
        setModalVisible(true);
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
        <Text className="text-white text-xl mb-4 font-pregular">Upload & Scan QR/Barcode</Text>

        
       
        <CustomButton
          title="Select Image"
          handlePress={pickImage}
          containerStyles="bg-secondary mt-4 mb-6"
          textStyles="text-primary"
          
        />

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
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg p-6 w-11/12">
            <Text className="text-black text-lg font-bold mb-4">Scan Result</Text>
            {scanResult?.data ? (
              <>
                <ScrollView className="h-20 mb-4">
                  <Text className="text-black text-base">{scanResult.data}</Text>
                </ScrollView>
                <View className="flex-row justify-around mt-4">
                  <CustomButton title="Open Link" handlePress={() => handleAction("open")} />
                  <CustomButton title="Copy" handlePress={() => handleAction("copy")} />
                  <CustomButton title="Share" handlePress={() => handleAction("share")} />
                  <CustomButton title="Search" handlePress={() => handleAction("search")} />
                </View>
              </>
            ) : (
              <Text className="text-black">No QR Code or Barcode found.</Text>
            )}
            <CustomButton
              title="Close"
              handlePress={() => setModalVisible(false)}
              containerStyles="bg-secondary mt-4"
              textStyles="text-primary"
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

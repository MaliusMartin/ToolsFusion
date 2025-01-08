import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
//import { Alert, Platform } from "react-native";
// import RNFS from "react-native-fs";
import { 
  View, 
  Text, 
  TextInput, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image 
} from "react-native";


const Generate = () => {
  const [barcodeType, setBarcodeType] = useState("ean13");
  const [inputValue, setInputValue] = useState("");
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);

  const barcodeOptions = [
    { value: "ean13", label: "EAN-13" },
    { value: "ean8", label: "EAN-8" },
    { value: "upca", label: "UPC-A" },
    { value: "code39", label: "Code 39" },
    { value: "code128", label: "Code 128" },
    { value: "itf", label: "ITF" },
    { value: "isbn10", label: "ISBN-10" },
    { value: "isbn13", label: "ISBN-13" },
  ];


  const handleGenerateQRCode = async () => {
    if (!inputValue) {
      return alert("Please enter text to generate a QR Code.");
    }
  
    try {
      const response = await fetch("https://toolsfusion.onrender.com/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: inputValue, // The data to encode
        }),
      });
  
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer(); // Get the image data as an ArrayBuffer
        const base64Image = `data:image/png;base64,${encode(arrayBuffer)}`; // Convert ArrayBuffer to Base64 string
  
        setQRCodeImage(base64Image); // Set the modal image as a base64 string
        setQRCodeModalVisible(true); // Open the modal
      } else {
        const errorResponse = await response.json();
        alert(`Failed to generate QR Code: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    }
  };
  
  

  const handleGenerateBarcode = () => {
    if (!inputValue) return alert("Please enter text to generate a Barcode.");
    // Add navigation or API call for Barcode generation here
  };

 

  const handleDownloadQRCode = async () => {
    if (!qrCodeImage) {
      return alert("No QR Code to download.");
    }
  
    try {
      const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
      const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;
  
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      alert(`QR Code saved to: ${fileUri}`);
    } catch (error) {
      console.error("Error saving QR Code:", error);
      alert("Failed to download QR Code.");
    }
  };
  
  

  const handlePrintQRCode = () => {
    if (qrCodeImage) {
      // Logic for printing QR Code
    }
  };

  const handleShareQRCode = () => {
    if (qrCodeImage) {
      // Logic for sharing QR Code
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-evenly", padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8 mt-10">
          <Text className="text-secondary text-3xl font-pbold text-center">
            Generate Code
          </Text>
          <Text className="text-white text-lg text-center mt-2 font-plight">
            Create QR Codes or Barcodes easily by providing the required details.
          </Text>
        </View>

        {/* Input Field */}
        <View className="bg-white rounded-lg p-4 shadow-md mb-6">
          <TextInput
            placeholder="Enter text or data to encode"
            placeholderTextColor="#888"
            value={inputValue}
            onChangeText={setInputValue}
            className="text-black text-lg p-2 rounded border border-gray-300 font-pregular"
          />
        </View>

        {/* Generate QR Code */}
        <View className="mb-6">
          <CustomButton
            title="Generate QR Code"
            handlePress={handleGenerateQRCode}
            containerStyles="bg-secondary"
            textStyles="text-primary"
          />
        </View>

        {/* Generate Barcode */}
        <View className="mb-6">
          <Text className="text-white text-lg mb-2 font-pregular">Select Barcode Type:</Text>
          <View className="bg-white rounded-lg shadow-md">
            <Picker
              selectedValue={barcodeType}
              onValueChange={(itemValue) => setBarcodeType(itemValue)}
              style={{ height: 50, color: "#000", fontFamily: "pregular" }}
            >
              {barcodeOptions.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
          </View>

          <CustomButton
            title="Generate Barcode"
            handlePress={handleGenerateBarcode}
            containerStyles="bg-secondary mt-4"
            textStyles="text-primary"
          />
        </View>

        {/* Footer */}
        <View className="items-center mt-auto mb-4">
          <Text className="text-white text-xs font-plight">
            Powered by Buda Technologies
          </Text>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal
  visible={qrCodeModalVisible}
  transparent={true}
  animationType="slide"
  onRequestClose={() => setQRCodeModalVisible(false)}
>
  <View className="flex-1 bg-black bg-opacity-70 justify-center items-center">
    <View className="bg-white rounded-lg p-6 w-11/12 items-center shadow-lg">
      {/* QR Code Header */}
      <Text className="text-black text-xl font-pbold mb-4">Your QR Code</Text>

      {/* QR Code Image */}
      {qrCodeImage && (
        <Image
          source={{ uri: qrCodeImage }}
          style={{ width: 200, height: 200 }}
          resizeMode="contain"
        />
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-6 space-x-6">
        <TouchableOpacity onPress={handleDownloadQRCode} className="bg-secondary px-4 py-2 rounded flex-row items-center space-x-2">
          <Image source={icons.download} style={{ width: 20, height: 20 }} />
          <Text className="text-primary font-pregular">Save</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePrintQRCode} className="bg-secondary px-4 py-2 rounded flex-row items-center space-x-2">
          <Image source={icons.printing} style={{ width: 20, height: 20 }} />
          <Text className="text-primary font-pregular">Print</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleShareQRCode} className="bg-secondary px-4 py-2 rounded flex-row items-center space-x-2">
          <Image source={icons.share} style={{ width: 20, height: 20 }} />
          <Text className="text-primary font-pregular">Share</Text>
        </TouchableOpacity>
      </View>

      {/* Close Button */}
      <TouchableOpacity
        onPress={() => setQRCodeModalVisible(false)}
        className="mt-8 flex-row items-center bg-secondary px-6 py-2 rounded"
      >
        <Image source={icons.closed} style={{ width: 20, height: 20, marginRight: 8 }} />
        <Text className="text-primary font-pregular">Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>




    </SafeAreaView>
  );
};

export default Generate;

import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as Print from "expo-print";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";

import { 
  View, 
  Text, 
  TextInput, 
  Modal, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView, 
  Image,
  Pressable 
} from "react-native";


const Generate = () => {
  const [barcodeType, setBarcodeType] = useState("ean13");
  const [inputValue, setInputValue] = useState("");
  const [inputBar, setInputBar] = useState("");
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [isSubmittingQR, setIsSubmittingQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmittingQR(true);
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
    finally {
      setIsSubmittingQR(false);
    }
  };
  
  

  const handleGenerateBarcode = async () => {
    if (!inputBar) {
      return alert("Please enter text to generate a Barcode.");
    }
  
    setIsSubmitting(true); // Show loading state
    try {
      const response = await fetch("https://toolsfusion.onrender.com/generate-barcode/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: inputBar, // The data to encode into a barcode
          type: barcodeType, // The selected barcode type (e.g., ean13, code128, etc.)
        }),
      });
  
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer(); // Get the image data as an ArrayBuffer
        const base64Barcode = `data:image/png;base64,${encode(arrayBuffer)}`; // Convert ArrayBuffer to Base64
  
        setQRCodeImage(base64Barcode); // Reuse the modal and display barcode image
        setQRCodeModalVisible(true); // Open the modal
      } else {
        const errorResponse = await response.json();
        alert(`Failed to generate Barcode: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error generating Barcode:", error);
      alert("An error occurred while generating the Barcode. Please try again.");
    } finally {
      setIsSubmitting(false); // Hide loading state
    }
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
  
  

  const handlePrintQRCode = async () => {
    if (!qrCodeImage) {
      return alert("No QR Code to print.");
    }
  
    try {
      await Print.printAsync({
        html: `
          <html>
            <body style="text-align: center;">
              <img src="${qrCodeImage}" style="width: 300px; height: 300px;" />
              <p>Thanks for using our app</p>
            </body>
          </html>
        `,
      });
    } catch (error) {
      console.error("Error printing QR Code:", error);
      alert("Failed to print QR Code.");
    }
  };
  

  
  const handleShareQRCode = async () => {
    if (!qrCodeImage) {
      return alert("No QR Code to share.");
    }
  
    try {
      // Save the Base64 image to a temporary file
      const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, ""); // Remove prefix
      const fileUri = `${FileSystem.cacheDirectory}QRCode_${Date.now()}.png`;
  
      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });
  
      // Check if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        return alert("Sharing is not available on this device.");
      }
  
      // Share the file
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error sharing QR Code:", error);
      alert("Failed to share QR Code. Please try again.");
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
        <Text className="text-white text-lg text-center mt-2 font-plight">
            Create QR Codes  and Barcode easily by providing the required details.
          </Text>
          <Text className="text-secondary text-3xl font-pbold text-center">
            QR Code
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
            isLoading={isSubmittingQR}
          />
        </View>

        {/* Generate Barcode */}
        <View className="mb-6">
        <Text className="text-secondary text-3xl font-pbold text-center">
            BAR Code
        </Text>
        
  <Text className="text-white text-lg mb-2 font-pregular">Select Barcode Type:</Text>
  
  {/* Barcode Type Picker */}
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

  {/* Input Field for Barcode Digits */}
  <View className="bg-white rounded-lg shadow-md mt-4 p-4">
    <TextInput
      placeholder={`Enter ${barcodeType.toUpperCase()} digits`}
      placeholderTextColor="#888"
      value={inputBar}
      onChangeText={setInputBar}
      keyboardType="numeric" // Numeric keyboard for entering digits
      maxLength={barcodeType === "ean13" ? 13 : barcodeType== "ean8"? 8: 10} // Example: limit length based on type
      className="text-black text-lg p-2 rounded border border-gray-300 font-pregular"
    />
  </View>

  {/* Generate Barcode Button */}
  <CustomButton
    title="Generate Barcode"
    handlePress={handleGenerateBarcode}
    containerStyles="bg-secondary mt-4"
    textStyles="text-primary"
    isLoading={isSubmitting}
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
  animationType="fade"
  onRequestClose={() => setQRCodeModalVisible(false)}
>
  <Pressable
    style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    onPress={() => setQRCodeModalVisible(false)}
  >
    <View className="bg-white rounded-lg p-6 w-11/12 items-center shadow-lg">
    <Text className="text-black text-xl font-pbold mb-4">Your QR Code</Text>

{/* QR Code Image */}
{qrCodeImage && (
  <Image
  source={{ uri: qrCodeImage }}
  style={{ width: '80%', height: '60%', maxWidth: 200, maxHeight: 200 }}
  resizeMode="contain"
/>
)}

{/* Action Buttons */}
<View className="flex-row justify-between mt-6 space-x-4">
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
  </Pressable>
</Modal>

    




    </SafeAreaView>
  );
};

export default Generate;

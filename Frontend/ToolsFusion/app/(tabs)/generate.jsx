import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {Link } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [inputBar, setInputBar] = useState("");
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [isSubmittingQR, setIsSubmittingQR] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const options = [
    { label: "URL", path: "(generate)/url", image: icons.url },
    { label: "Text", path: "(generate)/text", image: icons.text },
    { label: "Contact", path: "(generate)/contact", image: icons.contact },
    { label: "Email", path: "(generate)/email", image: icons.email },
    { label: "SMS", path: "(generate)/sms", image: icons.sms },
    { label: "Geo", path: "(generate)/geo", image: icons.location },
    { label: "Phone", path: "(generate)/phone", image: icons.phone },
    { label: "Events", path: "(generate)/calendar", image: icons.calendar },
    { label: "WiFi", path: "(generate)/wifi", image: icons.wifi },
    { label: "My QR", path: "(generate)/myqr", image: icons.myself },
  ];
  

  const barcodeOptions = [
    { value: "aztech", label: "AZTEC" },
    { value: "ean13", label: "EAN-13" },
    { value: "ean8", label: "EAN-8" },
    { value: "upc_a", label: "UPC-A" },
    { value: "upc_e", label: "UPC-E" },
    { value: "code39", label: "Code 39" },
    { value: "code93", label: "Code 93" },
    { value: "code128", label: "Code 128" },
    { value: "itf", label: "ITF" },
    { value: "isbn10", label: "ISBN-10" },
    { value: "isbn13", label: "ISBN-13" },
    { value: "issn", label: "ISSN" },
    { value: "msi", label: "MSI" },
    { value: "pharmacode", label: "Pharmacode" },
    { value: "codabar", label: "Codabar" },
    { value: "data_matrix", label: "Data Matrix" },
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
  
  

 
 // Add this function to save generation history
const saveGenerationHistory = async (data, type) => {
  try {
    const historyItem = {
      type: "Generate",
      data: data,
      barcodeType: type,
      timestamp: new Date().toLocaleString(),
    };

    const storedHistory = await AsyncStorage.getItem("history");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.unshift(historyItem); // Add new item at the beginning

    await AsyncStorage.setItem("history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving generation history:", error);
  }
};

// Call this function after generating the barcode
const handleGenerateBarcode = async () => {
  if (!inputBar) {
    return alert("Please enter text to generate a Barcode.");
  }

  setIsSubmitting(true);
  try {
    const response = await fetch("https://toolsfusion.onrender.com/generate-barcode/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: inputBar,
        type: barcodeType,
      }),
    });

    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      const base64Barcode = `data:image/png;base64,${encode(arrayBuffer)}`;

      setQRCodeImage(base64Barcode);
      setQRCodeModalVisible(true);

      // Save generation history
      saveGenerationHistory(inputBar, barcodeType);
    } else {
      const errorResponse = await response.json();
      alert(`Failed to generate Barcode: ${errorResponse.error || "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error generating Barcode:", error);
    alert("An error occurred while generating the Barcode. Please try again.");
  } finally {
    setIsSubmitting(false);
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
            Create Barcode & Qrcode easily
          </Text>
          
        </View>

      

        {/* Generate Barcode */}
        <View className="mb-6">
        <Text className="text-secondary text-3xl font-pbold text-center">
            Barcode
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
      // keyboardType="numeric" // Numeric keyboard for entering digits
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

<Text className="text-secondary text-3xl font-pbold text-center mb-4">
            QRcode
          </Text>
<View className="flex-row flex-wrap justify-between">
            {options.map((option, index) => (
              <Link key={index} href={option.path} asChild>
                <TouchableOpacity 
                  className="w-[48%] bg-secondary p-4 mb-4 rounded-lg items-center justify-center"
                >
                  <Image 
                    source={option.image} 
                    className="w-12 h-12 mb-2"
                    tintColor={"#fff"} 
                  />
                  <Text className="text-primary font-pbold">{option.label}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>


       {/* Footer */}
               <View className="items-center mt-auto mb-2">
               <Text className="text-secondary text-sm font-pbold mt-2 text-center">
                   QR & Bar Pro
                 </Text>
                 <Text className="text-white text-sm font-plight">
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

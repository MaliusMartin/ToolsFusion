import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from "react-native";
import axios from "axios";
import * as Print from "expo-print";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Picker } from "@react-native-picker/picker";
import CheckBox from 'expo-checkbox';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Wifi = () => {
  const [ssid, setSSID] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [isSubmittingQR, setIsSubmittingQR] = useState(false);
  const [encryption, setEncryption] = useState("WAP/WAP2");

  const encryptionOptions = [
    { value: "WAP", label: "WAP" },
    { value: "WAP2", label: "WAP2" },
    { value: "WEP", label: "WEP" },
    { value: "", label: "No password" },
  ];

  const handleGenerateQRCode = async () => {
    if (!ssid) {
      return alert("Please enter the SSID (Network name).");
    }

    if (encryption !== "" && !password) {
      return alert("Please enter a password for the selected encryption type.");
    }

    const dataToEncode = `SSID | Network name: ${ssid}\n Password: ${
      password || "None"
    }\n Encryption: ${encryption || "None"}`;
    setIsSubmittingQR(true);
    try {
      const response = await fetch("https://toolsfusion.onrender.com/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataToEncode,
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        const base64Image = `data:image/png;base64,${encode(arrayBuffer)}`;

        setQRCodeImage(base64Image);
        setQRCodeModalVisible(true);
        saveToHistory();
      } else {
        const errorResponse = await response.json();
        alert(`Failed to generate QR Code: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      alert(`An error occurred: ${error.message}`);
    } finally {
      setIsSubmittingQR(false);
    }
  };

  const handleEncryptionChange = (value) => {
    setEncryption(value);
    if (value === "") {
      setPassword("");
    }
  };

  const saveToHistory = async () => {
    const newEntry = {
      type: " WiFi QR Code",
      data: `SSID | Network name: ${ssid}\n Password: ${password || "None"}\n Encryption: ${encryption || "None"}`,
      timestamp: new Date().toLocaleString(),
    };
  
    try {
      // Retrieve existing history
      const existingHistory = await AsyncStorage.getItem("history");
      const history = existingHistory ? JSON.parse(existingHistory) : [];
  
      // Add new entry to the history
      history.push(newEntry);
      history.unshift(newEntry); // Add new item at the beginning
  
      // Save updated history back to AsyncStorage
      await AsyncStorage.setItem("history", JSON.stringify(history));
      alert("Saved to history!");
    } catch (error) {
      console.error("Error saving to history:", error);
      alert("Failed to save history. Please try again.");
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
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-evenly",
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8 mt-10">
          <Text className="text-secondary text-3xl font-pbold text-center">
            QR Code Generator
          </Text>

          <Text className="text-white text-lg text-2xl text-center mt-2 font-pbold">
            Create QR Code of a WiFi network
          </Text>

          <Image
            source={icons.wifi}
            style={{ width: 80, height: 80 }}
            className="mt-4"
            tintColor={"#fff"}
            resizeMode="contain"
          ></Image>
        </View>

        {/* SSID/ Network name Input */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TextInput
            placeholder="SSID | Network name "
            placeholderTextColor="#888"
            value={ssid}
            onChangeText={setSSID}
            className="text-primary text-base font-pregular"
          />
        </View>

        {/* Password Input */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TextInput
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!passwordVisible}
            className="text-primary text-base font-pregular"
            editable={encryption !== ""}
          />
          <View className="flex-row items-center mt-2">
            <CheckBox
              value={passwordVisible}
              onValueChange={setPasswordVisible}
            />
            <Text className="ml-2 text-primary text-sm">Show Password</Text>
          </View>
        </View>

        <Text className="text-white text-lg mb-2 font-pregular">
          Encryption type
        </Text>

        {/* Encryption Type Picker */}
        <View className="bg-white rounded-lg shadow-md mb-6">
          <Picker
            selectedValue={encryption}
            onValueChange={handleEncryptionChange}
            style={{ height: 50, color: "#000", fontFamily: "pregular" }}
          >
            {encryptionOptions.map((option) => (
              <Picker.Item
                key={option.value}
                label={option.label}
                value={option.value}
              />
            ))}
          </Picker>
        </View>

        {/* Generate QR Code Button */}
        <View className="mb-6">
          <CustomButton
            title="Generate QR Code"
            handlePress={handleGenerateQRCode}
            containerStyles="bg-secondary"
            textStyles="text-primary"
            isLoading={isSubmittingQR}
          />
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

export default Wifi;

import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Modal, TouchableOpacity, SafeAreaView, ScrollView, Image, Pressable, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Calendar from "expo-calendar";
import AsyncStorage from "@react-native-async-storage/async-storage";


const EventsPage = () => {
  const [event, setEvent] = useState("");
  const [start, setStart] = useState(new Date()); // Start time as Date object
  const [end, setEnd] = useState(new Date()); // End time as Date object
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [isSubmittingQR, setIsSubmittingQR] = useState(false);
  const [selectedCalendarId, setSelectedCalendarId] = useState(null);
  const [calendars, setCalendars] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false); // Controls visibility of start DateTimePicker
  const [showEndPicker, setShowEndPicker] = useState(false); // Controls visibility of end DateTimePicker

  // Fetch calendars and request permissions
  useEffect(() => {
    const fetchCalendars = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        const calendars = await Calendar.getCalendarsAsync();
        setCalendars(calendars);
        if (calendars.length > 0) {
          setSelectedCalendarId(calendars[0].id); // Default to the first calendar
        }
      }
    };

    fetchCalendars();
  }, []);

  // Handle start date/time change
  const handleStartChange = (event, selectedDate) => {
    setShowStartPicker(false); // Hide the picker
    if (selectedDate) {
      setStart(selectedDate); // Update the start time
    }
  };

  // Handle end date/time change
  const handleEndChange = (event, selectedDate) => {
    setShowEndPicker(false); // Hide the picker
    if (selectedDate) {
      setEnd(selectedDate); // Update the end time
    }
  };

  const saveToHistory = async () => {
    const newEntry = {
      type: "QR Code",
      data: `Event: ${event}\nStarting Time: ${start.toLocaleString()}\nEnd: ${end.toLocaleString()}\nLocation: ${location}\nDescription: ${description}`,
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
      // alert("Saved to history!");
    } catch (error) {
      console.error("Error saving to history:", error);
      alert("Failed to save history. Please try again.");
    }
  };

  // Handle event creation
  const handleCreateEvent = async () => {
    if (!event || !start || !end || !selectedCalendarId) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const eventDetails = {
        title: event,
        startDate: start,
        endDate: end,
        location: location,
        notes: description,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        calendarId: selectedCalendarId,
      };

      const eventId = await Calendar.createEventAsync(selectedCalendarId, eventDetails);

      if (eventId) {
        Alert.alert("Success", "Event has been added to your calendar!", [
          {
            text: "OK",
            onPress: () => {
              // Clear form after successful creation
              setEvent("");
              setStart(new Date());
              setEnd(new Date());
              setLocation("");
              setDescription("");
            },
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create event: " + error.message);
    }
  };

  // Generate QR Code for the event
  const dataToEncode = `Event: ${event}\nStarting Time: ${start.toLocaleString()}\nEnd: ${end.toLocaleString()}\nLocation: ${location}\nDescription: ${description}`;

  const handleGenerateQRCode = async () => {
    if (!event || !start || !end) {
      return Alert.alert("Error", "Please fill in all required fields.");
    }

    setIsSubmittingQR(true);
    try {
      const response = await fetch("https://toolsfusion.onrender.com/generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: dataToEncode, // The data to encode
        }),
      });

      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer(); // Get the image data as an ArrayBuffer
        const base64Image = `data:image/png;base64,${encode(arrayBuffer)}`; // Convert ArrayBuffer to Base64 string

        setQRCodeImage(base64Image); // Set the modal image as a base64 string
        setQRCodeModalVisible(true); // Open the modal
        saveToHistory();
      } else {
        const errorResponse = await response.json();
        Alert.alert("Error", `Failed to generate QR Code: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      Alert.alert("Error", `An error occurred: ${error.message}`);
    } finally {
      setIsSubmittingQR(false);
    }
  };

  // Download QR Code
  const handleDownloadQRCode = async () => {
    if (!qrCodeImage) {
      return Alert.alert("Error", "No QR Code to download.");
    }

    try {
      const base64Data = qrCodeImage.replace(/^data:image\/png;base64,/, "");
      const fileUri = `${FileSystem.documentDirectory}QRCode_${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      Alert.alert("Success", `QR Code saved to: ${fileUri}`);
    } catch (error) {
      console.error("Error saving QR Code:", error);
      Alert.alert("Error", "Failed to download QR Code.");
    }
  };

  // Print QR Code
  const handlePrintQRCode = async () => {
    if (!qrCodeImage) {
      return Alert.alert("Error", "No QR Code to print.");
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
      Alert.alert("Error", "Failed to print QR Code.");
    }
  };

  // Share QR Code
  const handleShareQRCode = async () => {
    if (!qrCodeImage) {
      return Alert.alert("Error", "No QR Code to share.");
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
        return Alert.alert("Error", "Sharing is not available on this device.");
      }

      // Share the file
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error sharing QR Code:", error);
      Alert.alert("Error", "Failed to share QR Code. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "space-evenly", padding: 20 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="items-center mb-8 mt-10">
          <Text className="text-secondary text-3xl font-pbold text-center">QR Code Generator</Text>
          <Text className="text-white text-lg text-center mt-2 font-pbold">Create QR Code of a Calendar Event</Text>
          <Image source={icons.calendar} style={{ width: 80, height: 80 }} className="mt-4" tintColor={"#fff"} resizeMode="contain" />
        </View>

        {/* Event Form */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TextInput placeholder="Event name" placeholderTextColor="#888" value={event} onChangeText={setEvent} className="text-black text-lg p-2 font-pregular" />
        </View>

        {/* Start Time Picker */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TouchableOpacity onPress={() => setShowStartPicker(true)}>
            <Text className="text-black text-lg p-2 font-pregular">
              Start Time: {start.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showStartPicker && (
            <DateTimePicker
              value={start}
              mode="datetime"
              display="default"
              onChange={handleStartChange}
            />
          )}
        </View>

        {/* End Time Picker */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <Text className="text-black text-lg p-2 font-pregular">
              End Time: {end.toLocaleString()}
            </Text>
          </TouchableOpacity>
          {showEndPicker && (
            <DateTimePicker
              value={end}
              mode="datetime"
              display="default"
              onChange={handleEndChange}
            />
          )}
        </View>

        {/* Location */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TextInput placeholder="Location" placeholderTextColor="#888" value={location} onChangeText={setLocation} className="text-black text-lg p-2 font-pregular" />
        </View>

        {/* Description */}
        <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
          <TextInput placeholder="Description" placeholderTextColor="#888" value={description} onChangeText={setDescription} className="text-black text-lg p-2 font-pregular" />
        </View>

        {/* Calendar Picker */}
        {calendars.length > 0 && (
          <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
            <Picker selectedValue={selectedCalendarId} onValueChange={(itemValue) => setSelectedCalendarId(itemValue)}>
              {calendars.map((calendar) => (
                <Picker.Item key={calendar.id} label={calendar.title} value={calendar.id} />
              ))}
            </Picker>
          </View>
        )}

        {/* Generate QR Code Button */}
        <View className="mb-6">
          <CustomButton title="Generate QR Code" handlePress={handleGenerateQRCode} containerStyles="bg-secondary" textStyles="text-primary" isLoading={isSubmittingQR} />
        </View>

        {/* Footer */}
        <View className="items-center mt-auto mb-2">
          <Text className="text-secondary text-sm font-pbold mt-2 text-center">QR & Bar Pro</Text>
          <Text className="text-white text-sm font-plight">Powered by Buda Technologies</Text>
        </View>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal visible={qrCodeModalVisible} transparent={true} animationType="fade" onRequestClose={() => setQRCodeModalVisible(false)}>
        <Pressable style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }} onPress={() => setQRCodeModalVisible(false)}>
          <View className="bg-white rounded-lg p-6 w-11/12 items-center shadow-lg">
            <Text className="text-black text-xl font-pbold mb-4">Your QR Code</Text>

            {/* QR Code Image */}
            {qrCodeImage && <Image source={{ uri: qrCodeImage }} style={{ width: "80%", height: "60%", maxWidth: 200, maxHeight: 200 }} resizeMode="contain" />}

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
            <TouchableOpacity onPress={() => setQRCodeModalVisible(false)} className="mt-8 flex-row items-center bg-secondary px-6 py-2 rounded">
              <Image source={icons.closed} style={{ width: 20, height: 20, marginRight: 8 }} />
              <Text className="text-primary font-pregular">Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default EventsPage;
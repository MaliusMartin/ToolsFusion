import React, { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import CustomButton from "../../components/CustomButton";
import icons from "../../constants/icons";
import { encode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Calendar from 'expo-calendar';


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


const CalendarPage = () => {

  const [event, setEvent] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");


  const [qrCodeModalVisible, setQRCodeModalVisible] = useState(false);
  const [qrCodeImage, setQRCodeImage] = useState(null);
  const [isSubmittingQR, setIsSubmittingQR] = useState(false);
  
 const [calendars, setCalendars] = useState([]);
const [selectedCalendarId, setSelectedCalendarId] = useState(null);


// Add this useEffect to load calendars
useEffect(() => {
  (async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      setCalendars(calendars.filter(calendar => calendar.allowsModifications));
      // Set default calendar if available
      if (calendars.length > 0) {
        const primaryCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];
        setSelectedCalendarId(primaryCalendar.id);
      }
    }
  })();
}, []);
 
  
// Add this function to handle event creation
const handleCreateEvent = async () => {
  if (!event || !start || !end || !selectedCalendarId) {
    Alert.alert("Error", "Please fill in all required fields");
    return;
  }

  try {
    const eventDetails = {
      title: event,
      startDate: new Date(start),
      endDate: new Date(end),
      location: location,
      notes: description,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      calendarId: selectedCalendarId,
    };

    const eventId = await Calendar.createEventAsync(selectedCalendarId, eventDetails);
    
    if (eventId) {
      Alert.alert(
        "Success",
        "Event has been added to your calendar!",
        [{ text: "OK", onPress: () => {
          // Clear form after successful creation
          setEvent("");
          setStart(null);
          setEnd(null);
          setLocation("");
          setDescription("");
        }}]
      );
    }
  } catch (error) {
    Alert.alert("Error", "Failed to create event: " + error.message);
  }
};

const dataToEncode = `Event: ${event}\n Starting Time: ${start}\n End: ${end}\n Location: ${location}\n Description: ${description}`;
  
  const handleGenerateQRCode = async () => {
    if (!inputValue) {
      return alert("Please enter url to generate a QR Code.");
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
        <Text className="text-secondary text-3xl font-pbold text-center">
            QR Code generator
          </Text>
        <Text className="text-white text-lg text-center mt-2 font-pbold">
            Create QR Code of a Calendar.
          </Text>
          
          
          <Image
            source={icons.calendar}
            style={{ width: 80, height: 80 }}
            className="mt-4"
            tintColor={"#fff"}
            resizeMode="contain"
            >
          </Image>
        </View>

        {/* Event */}
    <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
           <TextInput
            placeholder="Event name"
            placeholderTextColor="#888"
            value={event}
            onChangeText={setEvent}
            className="text-black text-lg p-2 font-pregular"
            
            
          />
      </View>
   {/* Start */}
      <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
           <TextInput
            placeholder="Starting Time"
            placeholderTextColor="#888"
            value={start}
            onChangeText={setStart}
            className="text-black text-lg p-2 font-pregular"
           
            
            
          />
      </View>
  {/* End */}
      <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
           <TextInput
            placeholder="Ending Time"
            placeholderTextColor="#888"
            value={end}
            onChangeText={setEnd}
            className="text-black text-lg p-2 font-pregular"
            
            
          />
      </View>

     
      <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-4">
        <Picker
          selectedValue={selectedCalendarId}
          onValueChange={(itemValue) => setSelectedCalendarId(itemValue)}
          style={{ color: '#000' }}
        >
          <Picker.Item label="Select Calendar" value={null} />
          {calendars.map((calendar) => (
            <Picker.Item
              key={calendar.id}
              label={calendar.title}
              value={calendar.id}
            />
          ))}
        </Picker>
      </View>

      // Add a new button for creating the calendar event (add before or after QR code generation)
      <View className="mb-6">
        <CustomButton
          title="Add to Calendar"
          handlePress={handleCreateEvent}
          containerStyles="bg-secondary"
          textStyles="text-primary"
        />
      </View>

      {/* Location */}
    <View className="border-2 border-secondary rounded-lg p-2 bg-white mb-6">
           <TextInput
            placeholder="Location"
            placeholderTextColor="#888"
            value={location}
            onChangeText={setLocation}
            className="text-black text-lg p-2 font-pregular"
            
          />
      </View>

      {/* Description */}
    <View className="border-2 border-secondary rounded-lg p-2 bg-white flex-1 mb-6">
           <TextInput
            placeholder="Description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            className="text-black text-lg p-2 font-pregular"
            inputMode="url"
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

export default CalendarPage;

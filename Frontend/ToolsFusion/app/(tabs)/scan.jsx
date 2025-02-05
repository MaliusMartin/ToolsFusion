import { CameraView } from "expo-camera";
import {AppState,SafeAreaView,StyleSheet,View,Image,Text,TouchableOpacity, Linking,} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard'; 
import { Share } from "react-native";
import Overlay from "../(scan)/overlay";
import icons from "../../constants/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Scan = () => {
  const qrLock = useRef(false);
  const appState = useRef(AppState.currentState);
  const [scannedData, setScannedData] = useState(null);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        qrLock.current = false;
        setScannedData(null);
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  const handleOpenURL = async (url) => {
    try {
      await Linking.openURL(url);
      setScannedData(null);
      qrLock.current = false;
    } catch (err) {
      console.error("Failed to open URL:", err);
      setScannedData(null);
      qrLock.current = false;
    }
  };

  const handleShare = async (data) => {
    try {
      await Share.share({
        message: data,
        title: "Share QR Code Link"
      });
    } catch (error) {
      console.error("Error sharing link:", error);
      Alert.alert("Error", "Failed to share the link. Please try again.");
    }
  };

 

  const handleCopy = async (data) => {
    try {
      await Clipboard.setStringAsync(data); 
      // Optional: Show a brief toast or message indicating successful copy
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleSearch = async (data) => {
    try {
      await Linking.openURL(`https://www.google.com/search?q=${data}`);
      setScannedData(null);
      qrLock.current = false;
    } catch (err) {
      console.error("Failed to open URL:", err);
      setScannedData(null);
      qrLock.current = false;
    }
  };

  // Add this function to save scan history
const saveScanHistory = async (data) => {
  try {
    const historyItem = {
      type: "Scan",
      data: data,
      timestamp: new Date().toLocaleString(),
    };

    const storedHistory = await AsyncStorage.getItem("history");
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.unshift(historyItem); // Add new item at the beginning

    await AsyncStorage.setItem("history", JSON.stringify(history));
  } catch (error) {
    console.error("Error saving scan history:", error);
  }
};

// Call this function after setting scannedData
useEffect(() => {
  if (scannedData) {
    saveScanHistory(scannedData);
  }
}, [scannedData]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={({ data }) => { 
          if (data && !qrLock.current) { 
            qrLock.current = true; 
            setScannedData(data); // Update the scannedData state here
          } 
        }}
        barCodeTypes={[
          "aztec",
          "ean13",
          "ean8",
          "qr",
          "pdf417",
          "upc_e",
          "datamatrix",
          "code39",
          "code93",
          "itf14",
          "codabar",
          "code128",
          "upc_a",
        ]}
      />
      <Overlay />
      
      {/* Enhanced Link Overlay */}
      {scannedData && (
        <View style={styles.overlayContainer} className="font-pregular">
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={3}>
              {scannedData}
            </Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => handleOpenURL(scannedData)}
              >
                <Image source={icons.link} style={{ width: 20, height: 20 }} />
                <Text style={styles.buttonText} className="pregular">Open</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={() => handleShare(scannedData)}
              >
              <Image source={icons.share} style={{ width: 20, height: 20 }} />
                <Text style={styles.buttonText} className="pregular">Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.copyButton]}
                onPress={() => handleCopy(scannedData)}
              >
                <Image source={icons.copy} style={{ width: 20, height: 20 }} />
                <Text style={styles.buttonText} className="pregular">Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.copyButton]}
                onPress={() => handleSearch(scannedData)}
              >
                <Image source={icons.search} style={{ width: 20, height: 20 }} />
                <Text style={styles.buttonText} className="pregular">Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setScannedData(null);
                  qrLock.current = false;
                }}
              >
                <Image source={icons.closed} style={{ width: 20, height: 20 }} />
                <Text style={[styles.buttonText, styles.cancelText]} className="pregular">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  linkCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  linkText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    minWidth: '48%',
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
  },
  shareButton: {
    backgroundColor: "#34C759",
  },
  copyButton: {
    backgroundColor: "#5856D6",
  },
  cancelButton: {
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    color: "#666",
  },
});

export default Scan;
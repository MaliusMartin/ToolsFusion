import { CameraView } from "expo-camera";
import { Stack } from "expo-router";
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  Platform,
  View,
  Text,
  TouchableOpacity,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useRef, useEffect } from "react";
import * as Sharing from 'expo-sharing';
import * as Clipboard from 'expo-clipboard'; 
import Overlay from "../(scan)/overlay";

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
      await Sharing.shareAsync({
        uri: data, // Share the scanned data directly as a URI
        dialogTitle: 'Share scanned data',
      });
    } catch (error) {
      console.error("Failed to share:", error);
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
        <View style={styles.overlayContainer}>
          <View style={styles.linkCard}>
            <Text style={styles.linkText} numberOfLines={3}>
              {scannedData}
            </Text>
            <View style={styles.buttonGrid}>
              <TouchableOpacity
                style={[styles.button, styles.primaryButton]}
                onPress={() => handleOpenURL(scannedData)}
              >
                <Text style={styles.buttonText}>Open</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.shareButton]}
                onPress={() => handleShare(scannedData)}
              >
                <Text style={styles.buttonText}>Share</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.copyButton]}
                onPress={() => handleCopy(scannedData)}
              >
                <Text style={styles.buttonText}>Copy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setScannedData(null);
                  qrLock.current = false;
                }}
              >
                <Text style={[styles.buttonText, styles.cancelText]}>Cancel</Text>
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
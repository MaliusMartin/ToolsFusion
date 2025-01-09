import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from "react-native";
import { Camera,CameraView, CameraType, useCameraPermissions} from "expo-camera";

const Scan = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    Alert.alert("Scanned Successfully", `Type: ${type}\nData: ${data}`, [
      { text: "OK", onPress: () => setScanned(false) },
    ]);
  };

  if (hasPermission === null) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">No access to camera</Text>
        <TouchableOpacity
          onPress={() => Camera.requestCameraPermissionsAsync()}
          className="mt-4"
        >
          <Text className="text-blue-500">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black px-5">
      <Text className="text-white text-2xl font-bold text-center mb-5">Scan Barcode</Text>

      <View className="flex-1 rounded-lg overflow-hidden">
     
      <Camera
  ref={(ref) => setCameraRef(ref)}
  style={{ flex: 1 }}
  onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
  barCodeScannerSettings={{
    barCodeTypes: [
      Camera.Constants.BarCodeType.qr,
      Camera.Constants.BarCodeType.ean13,
      Camera.Constants.BarCodeType.ean8,
      Camera.Constants.BarCodeType.code128,
      Camera.Constants.BarCodeType.upc_a,
      Camera.Constants.BarCodeType.upc_e,
      Camera.Constants.BarCodeType.code39,
      Camera.Constants.BarCodeType.code93,
      Camera.Constants.BarCodeType.itf14,
      Camera.Constants.BarCodeType.pdf417,
      Camera.Constants.BarCodeType.aztec,
    ],
  }}
/>


      </View>
      barcodeScannerSettings={{
    barcodeTypes: ["qr"],
  }}
      {scannedData && (
        <View className="bg-white rounded-lg p-4 mt-5">
          <Text className="text-lg font-bold text-gray-800">Scanned Data:</Text>
          <Text className="text-base text-gray-700 mt-2">{scannedData}</Text>
        </View>
      )}

      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          className="bg-purple-600 rounded-lg py-3 mt-5 items-center"
        >
          <Text className="text-white text-lg">Scan Again</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Scan;

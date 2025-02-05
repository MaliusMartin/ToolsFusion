import React, {useState, useEffect} from "react";
import { View, Text, Image, SafeAreaView, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { router, Link } from "expo-router";
import icons from "../../constants/icons";


const Home = () => {
 

  const options = [
      { label: "Camera to scan", path: "(tabs)/scan", image: icons.camera },
      { label: "Upload to scan", path: "(scan)/uploaded", image: icons.gallery },
      { label: "Create QR Code", path: "(generate)/gindex", image: icons.scan },
      { label: "Create Barcode", path: "(generate)/barcode", image: icons.barcode },
      
    ];
  
    


   

  return (
    <SafeAreaView className="bg-primary flex-1">
      
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "space-evenly", padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
       
        {/* Header */}
        <View className="items-center mb-8 ml-12">
          <Image
            source={icons.logo}
            style={{ width: 300, height: 200 }}
            tintColor={"#fff"}
            resizeMode="contain"
            alt="App Logo"
          />
        </View>

        <Text className="text-white  text-xl font-pbold mt-2 text-center mb-3">
        Scan and Generate {"\n"}QR Code and Barcode
          </Text>


     <View className=" mr-4">

     <View className="flex-row flex-wrap justify-between items-center">
                 {options.map((option, index) => (
                   <Link key={index} href={option.path} asChild>
                     <TouchableOpacity
                       className="w-[45%] bg-secondary p-4 mb-4 rounded-lg items-center justify-center ml-4"
                     >
                       
                        <Image
                          source={option.image}
                          style={{ width: 80, height: 80 }}
                          className="mt-4"
                          tintColor={"#fff"}
                          resizeMode="contain"
                                            >
                                          </Image>
                       <Text className="text-white font-pbold">{option.label}</Text>
                     </TouchableOpacity>
                   </Link>
                 ))}
        </View>
     </View>
        {/* Info Section */}
        <View className="mt-10">
          <Text className="text-white text-center text-lg font-plight">
            Simplify your daily tasks with our advanced QR and Barcode tools.
          </Text>
         
        </View>




       
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

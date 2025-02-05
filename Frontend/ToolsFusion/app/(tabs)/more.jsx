import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';
import icons from '../../constants/icons';

const options = [
  { label: "Settings", path: "(set)/settings" , image: icons.settings },
  { label: "History", path: "(tabs)/history", image: icons.pedometer },
  { label: "Learn", path: "(generate)/notes", image: icons.notes },
 
 
];

const More = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="flex-1 bg-primary p-4 mt-16">
        <Text className="text-white text-2xl font-pbold mb-2 text-center">More options</Text>

        <View className="items-center mt-auto mb-4">

        <Image
            source={icons.application}
            style={{ width: 40, height: 40 }}
            className="mt-4"
            tintColor={"#fff"}
            resizeMode="contain"
              >
               </Image>

        </View>
         
        <ScrollView>
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

          
        </ScrollView>
         {/* Footer */}
                <View className="items-center mt-auto mb-2">
                <Text className="text-secondary text-sm font-pbold mt-2 text-center">
                    QR & Bar Pro
                  </Text>
                  <Text className="text-white text-sm font-plight">
                    Powered by Buda Technologies
                  </Text>
                </View>
      </View>
    </SafeAreaView>
  );
};

export default More;
import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image } from 'react-native';
import { Link } from 'expo-router';
import icons from '../../constants/icons';

const options = [
  { label: "URL", path: "/generate/url", image: icons.url },
  { label: "Text", path: "/generate/text", image: icons.text },
  { label: "Contact", path: "/generate/contact", image: icons.contact },
  { label: "Email", path: "/generate/email", image: icons.email },
  { label: "SMS", path: "/generate/sms", image: icons.sms },
  { label: "Geo", path: "/generate/geo", image: icons.location },
  { label: "Phone", path: "/generate/phone", image: icons.phone },
  { label: "Calendar", path: "/generate/calendar", image: icons.calendar },
  { label: "WiFi", path: "/generate/wifi", image: icons.wifi },
  { label: "My QR", path: "/generate/myqr", image: icons.myself },
];

const Index = () => {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="flex-1 bg-primary p-4 mt-16">
        <Text className="text-white text-2xl font-pbold mb-4 text-center">Generate QR Code</Text>
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
                  />
                  <Text className="text-white font-pmedium">{option.label}</Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Index;
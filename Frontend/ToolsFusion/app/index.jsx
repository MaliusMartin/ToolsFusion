import { SafeAreaView, Text, View, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, Redirect, router } from 'expo-router';
import React from 'react';
import { images } from '../constants/images';
import icons from '../constants/icons';
import CustomButton from '../components/CustomButton';

export default function Index() {
  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 justify-center items-center px-4">
          <Image 
            source={icons.logo} 
            style={{ width: 300, height: 200 }} 
            resizeMode="contain" 
            accessibilityLabel="Camera Icon"
          />
          
          <View className="mt-5">
            <Text className="text-3xl font-pbold text-center">
              Welcome to <Text className="text-secondary">QR & Bar Pro</Text>
              {"\n"}advanced scanner and generator
            </Text>
            <Text className="text-sm font-pregular mt-7 text-center">
              Developed by Buda Technologies
            </Text>
          </View>

       
            <CustomButton 
            
              title="Explore the app"
              handlePress={() => router.push("/home")}
              containerStyles="mt-7 w-full"
            />
            <CustomButton 
              title="Register"
              handlePress={() => router.push("/sign-up")}
              containerStyles="mt-7 w-full"
            />
            <CustomButton 
              title="Login"
              handlePress={() => router.push("/sign-in")}
              containerStyles="mt-7 w-full"
            />
         
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}
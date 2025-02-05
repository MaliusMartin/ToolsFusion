import {  Text, View, Image } from 'react-native'
import React from 'react'
import { Tabs, Redirect, Stack } from 'expo-router'
import icons from '../../constants/icons' 
import { StatusBar } from 'expo-status-bar';


const TabIcon = ({ icon, color, name, focused }) => (
  <View className="items-center justify-center mt-4 mb-4"  style={{ margin: 2, padding: 2 }}>
    <Image
      source={icon}
      resizeMode="contain"
      tintColor={color}
      className="w-10 h-10" // Adjust the width and height as needed
    />
    <Text
      className={`${
        focused ? 'font-psemibold' : 'font-pbold'
      } font-xs`}
      style={{ color: color }}
    >
      {name}
    </Text>
  </View>
);

const Tabslayout = () => {
  return (
    <>
    
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#3C9EEA", //14a21f
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: true,
          tabBarStyle: {
            backgroundColor: "#161622",
            font: "psemibold",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 55, // Adjust the height as needed
          },
        }}
      >

       

<Tabs.Screen
          name='home'
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            )
          }}
        />


        


        <Tabs.Screen
          name='generate'
          options={{
            title: "Generate",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.image}
                color={color}
                name="Generate Codes"
                focused={focused}
              />
            )
          }}
        />




        <Tabs.Screen
          name='scan'
          options={{
            title: "Scan",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.scan}
                color={color}
                name="Scan"
                focused={focused}
              />
            )
          }}
        />

        



        


<Tabs.Screen
          name='history'
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.pedometer}
                color={color}
                name="History"
                focused={focused}
              />
            )
          }}
        />


<Tabs.Screen
          name='more'
          options={{
            title: "More",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.application}
                color={color}
                name="More"
                focused={focused}
                className="font-psemibold"
              />
            )
          }}
        />

      </Tabs>

    </>
  );
}

export default Tabslayout;
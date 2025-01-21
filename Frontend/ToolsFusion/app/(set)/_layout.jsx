import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';

const SetLayout = () => {
  return (
    <>
    <Stack>
  
    < Stack.Screen name="scanhistory" options = {{headerShown: false}} />

    < Stack.Screen name="generatedcodes" options = {{headerShown: false}} />


    </Stack>
    
    <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default SetLayout

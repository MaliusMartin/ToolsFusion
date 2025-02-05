import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar';

const   GenerateLayout = () => {
  return (
    <>
    <Stack>
    < Stack.Screen name="gindex" options = {{headerShown: false}} />

    < Stack.Screen name="calendar" options = {{headerShown: false}} />

    < Stack.Screen name="contact" options = {{headerShown: false}} />

    < Stack.Screen name="email" options = {{headerShown: false}} />

    < Stack.Screen name="geo" options = {{headerShown: false}} />

    < Stack.Screen name="myqr" options = {{headerShown: false}} />

    < Stack.Screen name="phone" options = {{headerShown: false}} />

    < Stack.Screen name="sms" options = {{headerShown: false}} />

    < Stack.Screen name="text" options = {{headerShown: false}} />

    < Stack.Screen name="url" options = {{headerShown: false}} />

    < Stack.Screen name="wifi" options = {{headerShown: false}} />

    < Stack.Screen name="barcode" options = {{headerShown: false}} />

    < Stack.Screen name="notes" options = {{headerShown: false}} />

    

    </Stack>
    
    <StatusBar backgroundColor="#161622" style="light" />
    </>
  )
}

export default  GenerateLayout 

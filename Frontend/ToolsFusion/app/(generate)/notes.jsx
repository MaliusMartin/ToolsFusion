import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
} from "react-native";
import icons from "../../constants/icons";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState(null); // State to store the selected note
  const [modalVisible, setModalVisible] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("https://toolsfusion.onrender.com/notes/");
        const data = await response.json();
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-2">Loading Notes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ padding: 20 }}>

         {/* Header */}
      <View className="items-center mb-8 mt-10">
        <Text className="text-2xl font-pbold text-center text-white mb-5 mt-6">Quick Notes</Text>
                  
        
        <Image
          source={icons.notes}
           style={{ width: 80, height: 80 }}
           className="mt-4"
           tintColor={"#fff"}
           resizeMode="contain" >
          </Image>
                </View>
        {notes.map((note) => (
          <View key={note.id} className="bg-secondary mb-5 p-4 rounded-lg shadow-lg">
            <Image
              source={{ uri: note.image }}
              className="w-full h-40 rounded-lg mb-3"
              resizeMode="cover"
            />
            <Text className="text-xl font-psemibold text-primary mb-2">{note.title}</Text>
            <Text className="text-white font-pregular mb-3">{note.description.substring(0, 150)}...</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedNote(note); // Set the selected note
                setModalVisible(true); // Show the modal
              }}
            >
              <Text className="text-primary underline font-psemibold">Read More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Modal for showing note details */}
      {selectedNote && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
            <ScrollView>
          <View className="flex-1 justify-center items-center bg-black bg-opacity-70">
            <View className="bg-secondary rounded-lg p-5 w-11/12">
              <Image
                source={{ uri: selectedNote.image }}
                className="w-full h-60 rounded-lg mb-3"
                resizeMode="cover"
              />
              <Text className="text-2xl font-pbold text-primary mb-4">{selectedNote.title}</Text>
              <ScrollView>
                <Text className="text-white text-lg font-pregular">{selectedNote.description}</Text>
              </ScrollView>
              <Pressable
                onPress={() => setModalVisible(false)}
                className="mt-5 bg-primary py-3 rounded-lg items-center"
              >
                <Text className="text-white font-psemibold">Close</Text>
              </Pressable>
            </View>
          </View>
          </ScrollView>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default Notes;

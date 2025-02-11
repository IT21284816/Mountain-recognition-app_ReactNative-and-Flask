import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const navigation = useNavigation();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); // Reset prediction when a new image is picked
      setDescription(null); // Reset description
    }
  };

  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }

    try {
      const formData = new FormData();

      if (Platform.OS === "web") {
        // Fetch the file and convert it to a Blob
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });

        formData.append("image", file);
      } else {
        // Use the standard format for mobile (Android/iOS)
        formData.append("image", {
          uri: image,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
      }

      const result = await fetch("http://192.168.8.102:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await result.json();

      if (data.prediction) {
        setPrediction(data.prediction);
        setDescription(data.description); // Store description from API
      } else {
        alert("Prediction failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading the image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button 
          title="Live Camera" 
          onPress={() => navigation.navigate('LiveCamera' as never)}
        />
      </View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Upload and Predict" onPress={uploadImage} />
        </>
      )}

      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>Prediction: {prediction}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 16,
  },
  predictionContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    alignItems: "center",
  },
  predictionText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  descriptionText: {
    marginTop: 8,
    fontSize: 16,
    textAlign: "center",
    color: "#34495e",
  },
  buttonContainer: {
    marginBottom: 10,
  },
});

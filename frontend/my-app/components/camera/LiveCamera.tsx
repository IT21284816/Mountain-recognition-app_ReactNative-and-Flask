import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from "react-native";
import axios from "axios"; 

export default function LiveCamera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  async function capturePhoto() {
    if (!cameraRef.current) return;

    try {
      setIsLoading(true);

      const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: false });

      if (!photo) return;

      predictImage(photo.uri);
    } catch (error) {
      console.error("Error capturing photo:", error);
      Alert.alert("Error", "Failed to capture photo.");
      setIsLoading(false);
    }
  }

  async function predictImage(imageUri: string) {
    try {
      const formData = new FormData();

      formData.append("image", {
        uri: imageUri,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const response = await axios.post("https://7ec2-175-157-24-89.ngrok-free.app/predict", formData, {                              //http://192.168.8.102:5000/predict
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { prediction, description } = response.data;
      if (prediction) {
        setPrediction(prediction);
        setDescription(description);

        Alert.alert(
          "Prediction Result",
          `Predicted Mountain: ${prediction}\n\nDescription: ${description}`
        );
      } else {
        Alert.alert("Prediction failed", "Could not predict the mountain.");
      }
    } catch (error) {
      console.error("Prediction error:", error);
      Alert.alert("Error", "Failed to predict the image.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.captureButton} onPress={capturePhoto}>
            <Text style={styles.text}>Capture</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6347" />
          <Text style={styles.loadingText}>Waiting for prediction...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
  },
  button: {
    backgroundColor: "#008CBA",
    padding: 10,
    borderRadius: 10,
  },
  captureButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#FF6347",
    fontWeight: "bold",
  },
});

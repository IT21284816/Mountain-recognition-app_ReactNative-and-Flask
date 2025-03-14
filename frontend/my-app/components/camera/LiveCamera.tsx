import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert, 
  ActivityIndicator, 
  StatusBar,
  SafeAreaView
} from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; 

export default function LiveCamera() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0);
  const cameraRef = useRef<CameraView | null>(null);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionMessage}>
          We need your permission to use the camera for identifying mountains
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton} 
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
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

      const response = await axios.post("https://flask-app-453711.el.r.appspot.com/predict", formData, {
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

  const handleZoomChange = (value: number) => {
    setZoom(value);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
        zoom={zoom}
      >
        {/* Top Bar - Empty now */}
        <View style={styles.topBar}>
          <View style={styles.zoomIndicator}>
            <Text style={styles.zoomText}>{Math.round(zoom * 10)}x</Text>
          </View>
        </View>
        
        {/* Bottom Control Area */}
        <View style={styles.bottomControls}>
          {/* Zoom Slider */}
          <View style={styles.zoomContainer}>
            <Slider
              style={styles.zoomSlider}
              minimumValue={0}
              maximumValue={1}
              value={zoom}
              onValueChange={handleZoomChange}
              minimumTrackTintColor="#FF6347"
              maximumTrackTintColor="rgba(255,255,255,0.5)"
              thumbTintColor="#FFFFFF"
            />
          </View>
          
          {/* Camera Controls */}
          <View style={styles.cameraControls}>
            {/* Flip Camera Button */}
            <TouchableOpacity 
              style={styles.iconButton} 
              onPress={toggleCameraFacing}
            >
              <Ionicons name="camera-reverse-outline" size={28} color="white" />
            </TouchableOpacity>
            
            {/* Capture Button */}
            <TouchableOpacity 
              style={styles.captureButton} 
              onPress={capturePhoto}
            >
              <View style={styles.captureInner} />
            </TouchableOpacity>
            
            {/* Empty View for Balance */}
            <View style={styles.iconButton} />
          </View>
        </View>
      </CameraView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#FF6347" />
            <Text style={styles.loadingText}>Analyzing image...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#1A1A1A",
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: "center",
    color: "#CCCCCC",
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: "#FF6347",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    elevation: 3,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  camera: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomIndicator: {
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    justifyContent: "center",
  },
  zoomText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomControls: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingBottom: 40,
  },
  zoomContainer: {
    width: "80%",
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  zoomSlider: {
    width: "100%",
    height: 30,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  loadingBox: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
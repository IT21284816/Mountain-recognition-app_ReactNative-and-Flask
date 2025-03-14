import React, { useState, useRef, useEffect } from 'react';
import { 
  TouchableOpacity,
  Image, 
  View, 
  StyleSheet, 
  Text, 
  ImageBackground,
  Animated,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function ImagePickerExample() {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const resultsFadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Initial animation when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      })
    ]).start();
  }, []);
  
  useEffect(() => {
    // Animation when image is selected
    if (image) {
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(height);
    }
  }, [image]);
  
  useEffect(() => {
    // Animation when prediction is received
    if (prediction) {
      Animated.timing(resultsFadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    } else {
      resultsFadeAnim.setValue(0);
    }
  }, [prediction]);
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null);
      setDescription(null);
    }
  };
  
  const uploadImage = async () => {
    if (!image) {
      alert("Please select an image first.");
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      
      if (Platform.OS === "web") {
        const response = await fetch(image);
        const blob = await response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        formData.append("image", file);
      } else {
        formData.append("image", {
          uri: image,
          name: "image.jpg",
          type: "image/jpeg",
        } as any);
      }
      
      const result = await fetch("https://flask-app-453711.el.r.appspot.com/predict", {
        method: "POST",
        body: formData,
      });
      
      const data = await result.json();
      
      if (data.prediction) {
        setPrediction(data.prediction);
        setDescription(data.description);
      } else {
        alert("Prediction failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading the image.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ImageBackground 
      source={require('../../assets/background.jpg')} 
      style={styles.backgroundImage}
      blurRadius={3}
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
      >
        <Animated.View 
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Image Analyzer</Text>
            <Text style={styles.headerSubtitle}>Upload an image for analysis</Text>
          </View>
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity 
              style={styles.cameraButton} 
              onPress={() => navigation.navigate('LiveCamera' as never)}
            >
              <MaterialIcons name="camera" size={24} color="#fff" />
              <Text style={styles.buttonText}>Live Camera</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.galleryButton}
              onPress={pickImage}
            >
              <MaterialIcons name="photo-library" size={24} color="#fff" />
              <Text style={styles.buttonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
          >
            {image && (
              <Animated.View 
                style={[
                  styles.imageContainer,
                  {
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <Image source={{ uri: image }} style={styles.image} />
                
                {!loading ? (
                  <TouchableOpacity 
                    style={styles.analyzeButton}
                    onPress={uploadImage}
                    disabled={loading}
                  >
                    <FontAwesome5 name="brain" size={18} color="#fff" />
                    <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#fff" />
                    <Text style={styles.loadingText}>Analyzing...</Text>
                  </View>
                )}
              </Animated.View>
            )}
            
            {prediction && (
              <Animated.View 
                style={[
                  styles.resultsContainer,
                  { opacity: resultsFadeAnim }
                ]}
              >
                <View style={styles.predictionHeader}>
                  <FontAwesome5 name="tag" size={20} color="#4a148c" />
                  <Text style={styles.predictionHeaderText}>Result</Text>
                </View>
                
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionText}>{prediction}</Text>
                  
                  {description && (
                    <View style={styles.descriptionContainer}>
                      <Text style={styles.descriptionText}>{description}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            )}
          </ScrollView>
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  scrollView: {
    width: '100%',
    flex: 1,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  header: {
    width: '100%',
    marginTop: 50,
    marginBottom: 30,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  cameraButton: {
    backgroundColor: 'rgba(33, 150, 243, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  galleryButton: {
    backgroundColor: 'rgba(103, 58, 183, 0.9)',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  imageContainer: {
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  image: {
    width: width * 0.8,
    height: width * 0.6,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.51,
    shadowRadius: 13.16,
    elevation: 20,
  },
  analyzeButton: {
    backgroundColor: '#00C853',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  resultsContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  predictionHeader: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  predictionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4a148c',
    marginLeft: 10,
  },
  predictionContent: {
    padding: 20,
  },
  predictionText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4a148c',
    textAlign: 'center',
    marginBottom: 15,
  },
  descriptionContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#4a148c',
  },
  descriptionText: {
    fontSize: 16,
    color: '#424242',
    lineHeight: 24,
  }
});
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const Home = () => {
    const navigation = useNavigation();
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <ImageBackground
            source={require('../../assets/background.jpg')}
            style={styles.background}
            blurRadius={3}
        >
            <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
                style={styles.overlay}
            >
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>Mountain</Text>
                        <Text style={styles.subtitle}>Recognition System</Text>
                        <View style={styles.underline} />
                    </View>
                    
                    <View style={styles.container}>
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => navigation.navigate('ImagePicker' as never)}
                        >
                            <LinearGradient
                                colors={['#4287f5', '#3b77db']}
                                style={styles.gradient}
                            >
                                <Text style={styles.buttonText}>Mountain Recognition</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => navigation.navigate('LiveCamera' as never)}
                        >
                            <LinearGradient
                                colors={['#45b6f2', '#3ca4db']}
                                style={styles.gradient}
                            >
                                <Text style={styles.buttonText}>Weather</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </LinearGradient>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#000', // Add this to ensure no white flash
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)', // Add slight overlay
    },
    content: {
        flex: 1,
    },
    titleContainer: {
        alignItems: 'center',
        marginTop: 100,
        padding: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '800',
        color: '#FFFFFF',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.9)', // Increase text shadow
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 15,
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#E0E0E0',
        textAlign: 'center',
        marginTop: 8,
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.9)', // Add text shadow to subtitle
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    underline: {
        height: 4,
        width: 120,
        backgroundColor: '#4287f5',
        marginTop: 20,
        borderRadius: 2,
        shadowColor: '#4287f5',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 50,
    },
    button: {
        width: '100%',
        height: 65,
        marginVertical: 15,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 1,
        textShadowColor: 'rgba(0, 0, 0, 0.2)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
    },
});

export default Home;
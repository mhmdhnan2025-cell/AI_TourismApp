import { ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
const moon = require('../assets/onboardingimg/moon.png')
const GradientComponent = ({ children }) => {
    return (
        <LinearGradient
            colors={["#01411C", "#2E8B57"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1 }}
        >
            <ImageBackground source={moon}
                resizeMode="cover" style={{ flex: 1, justifyContent: 'center' }}>
                {children}
            </ImageBackground>
        </LinearGradient>
    )
}

export default GradientComponent;
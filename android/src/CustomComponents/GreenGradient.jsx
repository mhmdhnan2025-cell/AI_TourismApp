import LinearGradient from 'react-native-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
const GreenGradient = ({ children }) => {
    return (
        <LinearGradient 
              colors={['#01411C', '#0B6B3A', '#FFFFFF']}
              style={{flex:1}}
        >
            <SafeAreaView>
                {children}
            </SafeAreaView>
        </LinearGradient>
    )
}

export default GreenGradient;
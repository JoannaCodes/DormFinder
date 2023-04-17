import React from 'react' 
import { StyleSheet, View, Image } from 'react-native';
import SignUpForm from '../components/signupScreen/SignupForm';

const DORM_LOGO = 'https://cdn-icons-png.flaticon.com/512/1594/1594379.png'

const SignUpScreen = ({navigation}) => (
        <View style = {styles.container}>
            <View style = {styles.logoContainer}>
                <Image source = {{uri: DORM_LOGO, height:100, width: 100 }} />
            </View>
            <SignUpForm navigation= {navigation}/>
        </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
        paddingHorizontal: 12,
    },

    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    }
})

export default SignUpScreen
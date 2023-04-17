import React from 'react' 
import { StyleSheet, Text, View, Image } from 'react-native';
import LoginForm from '../components/loginScreen/LoginForm';

const DORM_LOGO = 'https://cdn-icons-png.flaticon.com/512/1594/1594379.png'

const LoginScreen = ({navigation}) => (
        <View style = {styles.container}>
            <View style = {styles.logoContainer}>
                <Image source = {{uri: DORM_LOGO, 
                    height:100, 
                    width: 100,
                     }} />
            </View>
            <LoginForm navigation= {navigation} />
        </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
        paddingHorizontal: 12,
    },

    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    }
})

export default LoginScreen
import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet,  Pressable, TouchableOpacity, Alert } from 'react-native'

import { Formik } from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'

import { firebase } from '../../../firebase'

const LoginForm = ({navigation}) => {
    const LoginFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        password: Yup.string()
            .required()
            .min(6, 'Your password has to have at least 8 characters'),
    })

    const onLogin = async (email, password) => {
        try {
            await firebase.auth().signInWithEmailAndPassword(email, password)
            console.log('Firebase Login Successful', email, password)
        } catch (error) {
            Alert.alert(
                'Error',
                'The password is invalid' + '\n\nCreate a new account?',
                [
                    {
                        text: 'No',
                        onPress: () => console.log('No'),
                        style: 'cancel',
                    },
                    {text: 'Yes', onPress: () => navigation.push('SignUp')}
                ]
            )
        }
    }
    

    return (
        <View style ={styles.wrapper}>
            <Formik
            initialValues={{email: '', password: '' }}
            onSubmit={values => {
                onLogin(values.email, values.password)
            }}
            validationSchema={LoginFormSchema}
            validateOnMount={true}
        >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
            <>
            <View style = {[styles.inputField,
            {
            borderColor: values.email.length < 1 || Validator.validate(values.email) 
            ? '#ccc' 
            : 'red'
            }
             ]}>
                <TextInput
                    placeholderTextColor="#A99E9E"
                    placeholder='Phone number, username or  email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    textContentType='emailAddress'
                    autoFocus={true}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    />
            </View>

            <View style = {[styles.inputField,
            {
            borderColor: 
                1 > values.password.length || values.password.length >= 6
                    ? '#ccc' 
                    : 'red'
            }
             ]}>
                <TextInput
                    placeholderTextColor="#A99E9E"
                    placeholder='Password'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    />
            </View>
            <View style ={{ alignItems:'flex-end', marginBottom: 30, marginRight: 30}}>
                <Text style={{color: '#0E898B'}}>Forgot Password?</Text>
            </View>

            <Pressable 
            titleSize ={20} 
            style={styles.button(isValid)}
            onPress = {handleSubmit}
            disabled={!isValid}
            >
                <Text style={styles.buttonText}>Log In</Text>
            </Pressable>

            <View style={styles.signupContainer}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={()=>navigation.push('SignUp')}>
                    <Text style={{color:'#0E898B', fontWeight: 'bold'}}> Sign Up</Text>
                </TouchableOpacity>
            </View>
            </>
            )}
        </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 70,
    },

    inputField: {
        height: 55,
        borderWidth: 1.5,
        borderColor: "#D9D9D9",
        borderRadius: 10,
        backgroundColor: '#FFFF',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,

    },

    button: isValid => ({
        backgroundColor: isValid ? '#0E898B' : '#91DDDE' ,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 42,
        borderRadius: 10,
        marginLeft: 30,
        marginRight: 30,
        marginTop: 10,
    }),

    buttonText: {
        fontWeight:'600',
        color: '#fff',
        fontSize: 17,
    },

    signupContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
    }

})

export default LoginForm
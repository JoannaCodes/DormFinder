import React, { useState } from 'react'
import { View, Text, TextInput, StyleSheet,  Pressable, TouchableOpacity, Alert} from 'react-native'

import { Formik } from 'formik'
import * as Yup from 'yup'
import Validator from 'email-validator'

import { firebase , db } from '../../../firebase'

const SignUpForm = ({navigation}) => {
    const SignUpFormSchema = Yup.object().shape({
        email: Yup.string().email().required('An email is required'),
        username: Yup.string().required().min(2, 'A username is required'),
        password: Yup.string()
            .required()
            .min(6, 'Your password has to have at least 8 characters'),
    })

    const getRandomProfilePicture = async () => {
        const response = await fetch('https://randomuser.me/api')
        const data = await response.json()
        return data.results[0].picture.large
    }

    const onSignup = async (email, password, username) => {
        try {
            const authUser = await firebase.auth().createUserWithEmailAndPassword(email, password)
            console.log('Account Created Successfully', email, password)
        
            db.collection('users').add({
                owner_uid: authUser.user.uid,
                username: username,
                email: authUser.user.email,
                profile_picture: await getRandomProfilePicture(),
            })
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert('Error', 'This email is already in use.')
            } else {
                Alert.alert('Error', error.message)
            }
        }
    }

    return (
        <View style ={styles.wrapper}>
            <Formik
            initialValues={{email: '', username: '', password: '' }}
            onSubmit={values => {
                onSignup(values.email, values.password, values.username)
            }}
            validationSchema={SignUpFormSchema}
            validateOnMount={true}
        >
            {({ handleChange, handleBlur, handleSubmit, values, isValid}) => (
            <>
                <View style = {[
                        styles.inputField,
                        {
                            borderColor: 
                                values.email.length < 1 || Validator.validate(values.email) 
                                ? '#ccc' 
                                : 'red'
                        },
                    ]}
                >
                <TextInput
                    placeholderTextColor="#A99E9E"
                    placeholder='Email'
                    autoCapitalize='none'
                    keyboardType='email-address'
                    autoFocus={true}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    />
                </View>

            <View 
                    style = {[
                        styles.inputField,
                    {
                        borderColor: 
                            1 > values.username.length || values.username.length >= 2
                                ? '#ccc' 
                                : 'red',
                    },
                ]}
             >
                <TextInput
                    placeholderTextColor="#A99E9E"
                    placeholder='Username'
                    autoCapitalize='none'
                    textContentType='username'
                    onChangeText={handleChange('username')}
                    onBlur={handleBlur('username')}
                    value={values.username}
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
                    secureTextEntry={true}
                    textContentType='password'
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                    />
            </View>
            <Pressable 
                titleSize ={20} 
                style={styles.button(isValid)}
                onPress = {handleSubmit}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </Pressable>

            <View style={styles.loginContainer}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                    <Text style={{color:'#0E898B', fontWeight: 'bold'}}> Log In</Text>
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

    loginContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginTop: 20,
    }

})

export default SignUpForm
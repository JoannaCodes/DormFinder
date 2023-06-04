import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
//
import BackgroundImg from '../../assets/img/bg-transferent.png';
import Google from '../../assets/img/google-logo.png';
import { BASE_URL } from '../../constants/index';

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const loginUser = async () => {
    try {
      const formData = new FormData();
      formData.append('tag', 'login_app');
      formData.append('username', username);
      formData.append('password', password);

      const response = await Axios.post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = response.data;

      if (data.status) {
        await AsyncStorage.setItem('user_data', JSON.stringify(data));
        await AsyncStorage.setItem('isUserLogin', 'true');
        navigation.dispatch(StackActions.replace('Main', { uid: data.id }));
        console.log(data);
      } else {
        alert('User Not Found');
      }
    } catch (err) {
      alert('An error occurred');
    }
  };

  const validateLogin = () => {
    if (username.trim() === '' || password.trim() === '') {
      alert('Please enter a valid username and password.');
    } else {
      loginUser();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.topBackgroundImgContainer}>
        <Image
          source={BackgroundImg}
          style={styles.backgroundImg}
          resizeMode="contain"
        />
      </View>
      <View style={styles.bottomBackgroundImgContainer}></View>
      <View style={styles.formContainer}>
        <View style={styles.formTopContainer}>
          {/* <Icon name="arrow-back-ios" size={30} color="#fff" /> */}
          <Text style={{ color: '#fff', fontSize: 30, fontWeight: 'bold' }}>
            Welcome!
          </Text>
        </View>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            {/*  */}
            <View style={styles.customInputContainer}>
              <TextInput
                style={{ padding: 0, color: '#000' }}
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
              />
            </View>
            {/*  */}
            {/*  */}
            <View style={styles.customInputContainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TextInput
                  style={{ padding: 0 }}
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Icon
                    name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                validateLogin();
              }}
            >
              <Text
                style={{ color: '#fff', fontWeight: 'bold', fontSize: 17 }}
              >
                Login
              </Text>
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <Text style={{ textAlign: 'center', color: '#fff' }}>Or</Text>
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: '#fff',
                  flexDirection: 'row',
                  padding: 12,
                  justifyContent: 'space-around',
                },
              ]}
            >
              <Image source={Google} style={{ height: 20, width: 20 }} />
              <Text style={{ fontWeight: 'bold' }}>
                Continue With Google
              </Text>
              <View></View>
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', marginVertical: 10 }}>
                <Text style={{ color: '#fff' }}>Don't Have An Account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Signup');
                  }}
                >
                  <Text
                    style={{
                      marginLeft: 5,
                      color: 'teal',
                      fontWeight: 'bold',
                    }}
                  >
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text
                  style={{
                    color: 'teal',
                    fontWeight: 'bold',
                  }}
                >
                  Forget Your Password?
                </Text>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050907',
  },
  topBackgroundImgContainer: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  backgroundImg: {
    height: '100%',
    width: '80%',
    marginRight: -15,
  },
  bottomBackgroundImgContainer: {
    flex: 1,
  },
  formContainer: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  formTopContainer: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 10,
    marginLeft: 10,
  },
  formBottomContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formBottomSubContainer: {
    width: '95%',
    borderRadius: 10,
    backgroundColor: 'rgba(127,127,127,0.5)',
    padding: 20,
    marginTop: 50, 
  },
  customInputContainer: {
    marginVertical: 10,
    borderWidth: 2,
    borderColor: 'teal',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: 'teal',
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
});

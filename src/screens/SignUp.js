/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackgroundImg from '../../assets/img/bg2.png';
import Google from '../../assets/img/google-logo.png';
import {BASE_URL} from '../../constants/index';
import COLORS from '../../constants/colors';

//google
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: 
  '232767448599-9kc9mhpe3qo3rt7q82f93m8s7t3v7pmo.apps.googleusercontent.com',
});

const Separator = ({title}) => {
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text style={{marginHorizontal: 5, color: 'gray'}}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default function Signup() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async mode => {
    if (mode === 'google') {
      Alert.alert('Signup with google');
      // google signup logic here
    } else {
      if (validateSignup()) {
        const formData = new FormData();
        formData.append('tag', 'signup_app');
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

        await Axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
          .then(() => {
            Alert.alert('User Created');
            navigation.navigate('Login');
          })
          .catch(error => {
            Alert.alert('User Not Created');
          });
      }
    }
  };

  const validateSignup = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email format regular expression
    let isValid = true;

    if (email.trim() === '' || !emailRegex.test(email)) {
      isValid = false;
    } else if (username.trim() === '' || password.trim() === '') {
      isValid = false;
    }

    return isValid;
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
      <View style={styles.bottomBackgroundImgContainer} />
      <View style={styles.formContainer}>


      <View style={styles.formTopContainer}>
    <View style={{ flexDirection: 'row', alignItems: 'center' , }}>
    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop: 20 }}>
        <Icon name="arrow-back-ios" size={30} color={COLORS.black} />
      </TouchableOpacity>
      <Text style={{ color: 'black', fontSize: 30, fontWeight: 'bold', marginLeft: 10, marginTop: 20 }}>
        Register
      </Text>
    </View>
</View>


        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            <View style={styles.customInputContainer}>
              <TextInput
                style={{padding: 0}}
                placeholder="Email"
                onChangeText={text => setEmail(text)}
              />
            </View>

            <View style={styles.customInputContainer}>
              <TextInput
                style={{padding: 0}}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
              />
            </View>

            <View style={styles.customInputContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput
                  style={{padding: 0}}
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={text => setPassword(text)}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                  <Icon
                    name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => handleSignUp()}>
              <Text
                style={{color: COLORS.white, fontWeight: 'bold', fontSize: 17}}>
                Signup
              </Text>
            </TouchableOpacity>

            <Separator title={'Or'} />

            <TouchableOpacity
              style={[
                styles.loginButton,
                {
                  backgroundColor: COLORS.white,
                  flexDirection: 'row',
                  padding: 12,
                  justifyContent: 'space-around',
                },
              ]}>
              <Image source={Google} style={{height: 20, width: 20}} />
              <Text style={{fontWeight: 'bold'}}>Continue With Google</Text>
              <View />
            </TouchableOpacity>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{color: 'black'}}>
                  Already Have An Account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text
                    style={{
                      marginLeft: 5,
                      color: COLORS.teal,
                      fontWeight: 'bold',
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  topBackgroundImgContainer: {
    flex: 1.5,
    alignItems: 'flex-end',
  },
  backgroundImg: {
    height: '100%',
    width: '85%',
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
    marginBottom: 20,
  },
  formBottomSubContainer: {
    width: '95%',
    borderRadius: 10,
    backgroundColor: 'rgba(127,127,127,0.5)',
    padding: 15,
    marginTop: 10,
    marginBottom: 10,
  },
  customInputContainer: {
    marginVertical: 10,
    borderWidth: 2,
    borderColor: COLORS.teal,
    backgroundColor: COLORS.white,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: COLORS.teal,
    padding: 10,
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 10,
  },
});

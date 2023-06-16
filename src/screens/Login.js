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
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
//
import BackgroundImg from '../../assets/img/bg-transferent.png';
import Google from '../../assets/img/google-logo.png';
import {BASE_URL} from '../../constants/index';

const Separator = ({title}) => {
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text style={{marginHorizontal: 5, color: '#FFFFFF'}}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

export default function Login({onLogin}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async mode => {
    if (mode === 'guest') {
      const formData = new FormData();
      formData.append('tag', 'login_app_guest');

      await axios
        .post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          const user = response.data;

          if (user.status) {
            onLogin(user);
            Toast.show({
              type: 'success',
              text1: 'StudyHive',
              text2: `Welcome, ${user.username}.`,
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2: 'Unable to enter guest mode.',
            });
          }
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'Please check your network and try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (mode === 'google') {
      Alert.alert('Login with google');
    } else if (mode === 'user') {
      if (validateLogin()) {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('tag', 'login_app');
        formData.append('username', username);
        formData.append('password', password);

        await axios
          .post(BASE_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            const user = response.data;

            if (user.status) {
              onLogin(user);
              Toast.show({
                type: 'success',
                text1: 'StudyHive',
                text2: `Hello, ${user.username}.`,
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'StudyHive',
                text2: 'User not found.',
              });
            }
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2: 'Please check your network and try again.',
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        Alert.alert('Fill in username or password');
      }
    }
  };

  const validateLogin = () => {
    let isValid = true;
    if (username.trim() === '' || password.trim() === '') {
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
          {/* <Icon name="arrow-back-ios" size={30} color="#fff" /> */}
          <Text style={{color: '#fff', fontSize: 30, fontWeight: 'bold'}}>
            Welcome!
          </Text>
        </View>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            {/*  */}
            <View style={styles.customInputContainer}>
              <TextInput
                style={{padding: 0, color: '#000'}}
                placeholder="Username"
                onChangeText={text => setUsername(text)}
              />
            </View>
            {/*  */}
            {/*  */}
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
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                handleLogin('user');
              }}>
              {isLoading ? (
                <ActivityIndicator color={'white'} size={'small'} />
              ) : (
                <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <Separator title={'Or'} />
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
              onPress={() => {
                handleLogin('google');
              }}>
              <Image source={Google} style={{height: 20, width: 20}} />
              <Text style={{fontWeight: 'bold'}}>Continue With Google</Text>
              <View />
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                handleLogin('guest');
              }}>
              <Text style={{color: '#fff', fontWeight: 'bold', fontSize: 17}}>
                Login as Guest
              </Text>
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{color: '#fff'}}>Don't Have An Account?</Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Signup');
                  }}>
                  <Text
                    style={{
                      marginLeft: 5,
                      color: 'teal',
                      fontWeight: 'bold',
                    }}>
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity>
                <Text
                  style={{
                    color: 'teal',
                    fontWeight: 'bold',
                  }}>
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
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
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
    bottom: 30,
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

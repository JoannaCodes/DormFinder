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
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackgroundImg from '../../assets/img/bg2.png';
import Google from '../../assets/img/google-logo.png';
import {BASE_URL} from '../../constants/index';
import COLORS from '../../constants/colors';

import axios from 'axios';
import Toast from 'react-native-toast-message';

import {API_URL, AUTH_KEY, CLIENT_ID} from '../../constants/index';

import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId:
    '836752097415-ooigkh9tvt94h0t382gi8q16uicnnd85.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  hostedDomain: 'http://studyhive.x10.mx/', // specifies a hosted domain restriction
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
  accountName: '', // [Android] specifies an account name on the device that should be used
  iosClientId: '<FROM DEVELOPER CONSOLE>', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
  googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
  openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
  profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
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
  const [isLoading, setLoading] = useState({google: false, signUp: false});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [agreement, setAgreement] = useState(false);
  const navigation = useNavigation();

  const signUp = async () => {
    GoogleSignin.configure({
      androidClientId: CLIENT_ID,
    });
    GoogleSignin.hasPlayServices()
      .then(hasPlayService => {
        if (hasPlayService) {
          setLoading(prev => ({...prev, google: true}));
          GoogleSignin.signIn()
            .then(async userInfo => {
              let formdata = new FormData();
              formdata.append('action', 'checkRegister');
              formdata.append('email', userInfo.user.email);
              formdata.append('username', userInfo.user.name);
              formdata.append('imageUrl', userInfo.user.photo);

              await axios
                .post(API_URL, formdata, {
                  headers: {
                    'Auth-Key': AUTH_KEY,
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then(response => {
                  console.log(response.data);
                  const code = response.data.code;
                  if (code === 200) {
                    Toast.show({
                      type: 'success',
                      text1: 'StudyHive',
                      text2: 'Successfully registered.',
                    });
                    navigation.navigate('Login');
                  }
                });
            })
            .catch(e => {
              Toast.show({
                type: 'error',
                text1: 'StudyHive',
                text2: 'The account is already registered!',
              });
            })
            .finally(() => {
              setLoading(prev => ({...prev, google: false}));
            });
        }
      })
      .catch(e => {
        console.log('ERROR IS: ' + JSON.stringify(e));
      });
  };

  const handleSignUp = async mode => {
    if (mode === 'google') {
      signUp();
    } else {
      if (!email || !password || !username) {
        Alert.alert('Incomplete Fields', 'Please fill in all the fields.');
        return;
      }

      if (!validateEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address.');
        return;
      }

      if (password.length < 8) {
        Alert.alert('Error', 'Password should be at least 8 characters long.');
        return;
      }

      if (validateSignup()) {
        setLoading(prev => ({...prev, signUp: true}));
        const formData = new FormData();
        formData.append('tag', 'signup_app');
        formData.append('email', email);
        formData.append('username', username);
        formData.append('password', password);

        await axios
          .post(BASE_URL, formData, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            const message = response.data;
            console.log(message);
            if (message === 'success') {
              Alert.alert(
                'Account created!',
                'Your account has been created. Please verify your email to login.',
              );
              navigation.navigate('Login');
            } else {
              Alert.alert(
                'Unable to create account!',
                'Username/Email is already taken. Please choose a different username/email.',
              );
            }
          })
          .catch(error => {
            Alert.alert(
              'Error occurred during the request:',
              'Please try again.',
            );
          })
          .finally(() => {
            setLoading(prev => ({...prev, signUp: false}));
          });
      }
    }
  };

  const validateEmail = emailAddress => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress);
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={{marginTop: 15}}>
                <Icon name="arrow-back-ios" size={30} color={'black'} />
              </TouchableOpacity>
              <Text
                style={{
                  color: 'black',
                  fontSize: 30,
                  fontFamily: 'Poppins-Regular',
                  marginLeft: 10,
                  marginTop: 20,
                }}>
                Register
              </Text>
            </View>
          </View>

          <View style={styles.formBottomContainer}>
            <View style={styles.formBottomSubContainer}>
              <View style={styles.customInputContainer}>
                <TextInput
                  style={{
                    padding: 0,
                    fontFamily: 'Poppins-Regular',
                    marginBottom: -2,
                  }}
                  placeholder="Email"
                  onChangeText={text => setEmail(text)}
                  keyboardType={'email-address'}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.customInputContainer}>
                <TextInput
                  style={{
                    padding: 0,
                    fontFamily: 'Poppins-Regular',
                    marginBottom: -2,
                  }}
                  placeholder="Username"
                  onChangeText={text => setUsername(text)}
                />
              </View>

              <View style={styles.customInputContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <TextInput
                    style={{
                      flex: 1,
                      padding: 0,
                      fontFamily: 'Poppins-Regular',
                      marginBottom: -2,
                    }}
                    placeholder="Password"
                    secureTextEntry={!isPasswordVisible}
                    onChangeText={text => setPassword(text)}
                    onSubmitEditing={() => {
                      if (password.length < 8) {
                        Alert.alert(
                          'Error',
                          'Password should be at least 8 characters long.',
                        );
                      }
                    }}
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

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <BouncyCheckbox
                  disableBuiltInState
                  isChecked={agreement}
                  onPress={() => setAgreement(!agreement)}
                  fillColor={COLORS.teal}
                  unfillColor={COLORS.white}
                  iconStyle={{borderColor: COLORS.teal}}
                />
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Terms and Privacy Policy')
                  }>
                  <Text style={{color: '#3A3b3c' , fontFamily: 'Poppins-Regular'}}>I accept the terms and privacy policy.</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.loginButton,
                  isLoading.signUp || (!agreement && {opacity: 0.5}),
                ]}
                disabled={isLoading.signUp || !agreement}
                onPress={() => handleSignUp()}>
                {isLoading.signUp ? (
                  <ActivityIndicator color={COLORS.white} size={'small'} />
                ) : (
                  <Text
                    style={{
                      color: COLORS.white,
                      fontSize: 15,
                      fontFamily: 'Poppins-SemiBold',
                      marginBottom: -2,
                    }}>
                    Signup
                  </Text>
                )}
              </TouchableOpacity>

              <Separator title={'Or'} />

              <View
                style={[
                  styles.buttonContainer,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <TouchableOpacity
                  style={[
                    styles.squareButton,
                    {
                      backgroundColor: COLORS.white,
                      flex: 1,
                      marginRight: 5,
                      marginLeft: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}
                  disabled={isLoading.google}
                  onPress={() => {
                    handleSignUp('google');
                  }}>
                  {isLoading.google ? (
                    <ActivityIndicator color={COLORS.teal} size={'small'} />
                  ) : (
                    <>
                      <Image source={Google} style={styles.squareButtonIcon} />
                      <Text style={styles.squareButtonText}>
                        Continue with Google
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 13,
                      fontFamily: 'Poppins-Regular',
                      marginBottom: -2,
                      marginTop: -5,
                    }}>
                    Already have an account?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}>
                    <Text
                      style={{
                        marginLeft: 5,
                        color: COLORS.teal,
                        fontSize: 13,
                        fontFamily: 'Poppins-SemiBold',
                        marginBottom: 4,
                        marginTop: -5,
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
    </ScrollView>
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
    flex: 1.4,
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
  scrollContainer: {
    flexGrow: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  squareButton: {
    width: 47,
    height: 47,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    elevation: 3,
  },
  squareButtonIcon: {
    height: 26,
    width: 25,
    marginLeft: -20,
  },
  squareButtonText: {
    color: 'black',
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    marginLeft: 20,
    marginTop: 2,
  },
});

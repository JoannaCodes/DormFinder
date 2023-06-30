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
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';

import BackgroundImg from '../../assets/img/bg1.png';
import Google from '../../assets/img/google-logo.png';
import Facebook from '../../assets/img/facebook-logo.png';
import {BASE_URL} from '../../constants/index';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';
import { API_URL, AUTH_KEY, CLIENT_ID } from '../../constants/index';

import {
  GoogleSignin,
} from '@react-native-google-signin/google-signin';

import messaging from '@react-native-firebase/messaging';


GoogleSignin.configure({
  scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '836752097415-ooigkh9tvt94h0t382gi8q16uicnnd85.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
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

export default function Login({onLogin}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});
  const navigation = useNavigation();

  const signIn = async () => {
    GoogleSignin.configure({
        androidClientId: CLIENT_ID,
    });
    GoogleSignin.hasPlayServices().then((hasPlayService) => {
      if (hasPlayService) {
        GoogleSignin.signIn().then( async (userInfo) => {
          let formdata = new FormData();
          formdata.append('action',  'checkLogin');
          formdata.append('email',  userInfo.user.email);
          
          await axios.post(API_URL, formdata, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Content-Type': 'multipart/form-data'
            },
          }).then(response => {
            const data = response.data.data;
            const code = response.data.code;
            if(code === 200) {
              onLogin(data);
              Toast.show({
                type: 'success',
                text1: 'StudyHive',
                text2: `Welcome, ${data.username}.`,
              });
            }
          });
        }).catch((e) => {
          Toast.show({
            type: 'error',
            text1: `Your account doesn\'t exist!`,
            text2: `Register your Google Account in Signup section first`,
          });
        })
      }
    }).catch((e) => {
        console.log("ERROR IS: " + JSON.stringify(e));
    })
  };

  const handleLogin = async mode => {
    if (mode === 'guest') {
      const formData = new FormData();
      formData.append('tag', 'login_app_guest');

      await axios
        .post(BASE_URL, formData, {
          headers: {
            'Auth-Key': AUTH_KEY,
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
      signIn();
    } else if (mode === 'user') {
      if (validateLogin()) {
        const token = await messaging().getToken();
        setIsLoading(true);
        const formData = new FormData();
        formData.append('tag', 'login_app');
        formData.append('username', username);
        formData.append('password', password);
        formData.append('fcm', token);

        await axios
          .post(BASE_URL, formData, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Content-Type': 'multipart/form-data'
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
        Alert.alert('Incomplete Fields', 'Please fill in all the fields.');
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
          <Text style={{color: 'black', fontSize: 30, marginTop: 20, fontFamily: 'Poppins-Regular'}}>
            Welcome!
          </Text>
        </View>
        <View style={styles.formBottomContainer}>
          <View style={styles.formBottomSubContainer}>
            {/*  */}
            <View style={styles.customInputContainer}>
              <TextInput
                style={{padding: 0, fontFamily: 'Poppins-Regular', marginBottom: -2}}
                placeholder="Email or Username"
                onChangeText={text => setUsername(text)}
                keyboardType={'email-address'}
                autoCapitalize="none"
              />
            </View>
            {/*  */}
            {/*  */}
            <View style={styles.customInputContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <TextInput
                  style={{ flex: 1, padding: 0, fontFamily: 'Poppins-Regular', marginBottom: -2}}
                  placeholder="Password"
                  secureTextEntry={!isPasswordVisible}
                  onChangeText={text => setPassword(text)}
                  autoCapitalize="none"
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
                <ActivityIndicator color={COLORS.white} size={'small'} />
              ) : (
                <Text
                  style={{
                    color: COLORS.white,
                    fontSize: 15, fontFamily: 'Poppins-SemiBold', marginBottom: -2
                  }}>
                  Login
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{
                  alignSelf: 'flex-end', 
                  marginTop: 10, 
                  marginBottom: -7,
                }}>
                <Text
                  style={{
                    color: '#454545',
                    marginTop: -10,
                    fontSize: 13, fontFamily: 'Poppins-SemiBold', marginBottom: -2
                  }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            {/*  */}
            {/*  */}
            <Separator title={'Or'} />
            {/*  */}
            {/*  */}

            
          <View style={[styles.buttonContainer, { justifyContent: 'center', alignItems: 'center' }]}>
            <TouchableOpacity
              style={[
                styles.squareButton,
                {
                  backgroundColor: COLORS.white,
                  flex: 1,
                  marginRight: 10,
                  marginLeft: 3,
                },
              ]}
              onPress={() => {
                handleLogin('google');
              }}
            >
              <Image source={Google} style={styles.squareButtonIcon} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.squareButton,
                {
                  backgroundColor: COLORS.white,
                  flex: 1,
                  marginRight: 5,
                },
              ]}
              onPress={() => {
                handleLogin('facebook');
              }}
            >
              <Image source={Facebook} style={styles.squareButtonIconFb} />
            </TouchableOpacity>
          </View>

            {/*  */}
            {/*  */}
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => {
                handleLogin('guest');
              }}>
              <Text
                style={{color: COLORS.white, fontSize: 15, fontFamily: 'Poppins-SemiBold', marginBottom: -2}}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
            {/*  */}
            {/*  */}
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <Text style={{color: 'black', fontSize: 13, fontFamily: 'Poppins-Regular', marginBottom: -2}}>
                  Don't Have An Account?
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('Signup');
                  }}>
                  <Text
                    style={{
                      marginLeft: 5,
                      color: COLORS.teal,
                      fontSize: 13, fontFamily: 'Poppins-SemiBold', marginBottom: 4, marginTop: -1
                    }}>
                    Signup
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/*  */}
          </View>
        </View>
      </View>
      <ForgotPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    flex: 1.5,
    alignItems: 'flex-end',
  },
  backgroundImg: {
    height: '100%',
    width: '90%',
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
    marginBottom: 30,
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
    borderColor: 'teal',
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
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginHorizontal: 10,
    elevation: 3,
  },
  squareButtonIcon: {
    height: 25,
    width: 25,
  },
  squareButtonIconFb: {
    height: 30,
    width: 30,
  },
    
});
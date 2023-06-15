/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
  SuccessToast,
} from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import BookmarksScreen from './src/screens/Bookmarks';
import HomeScreen from './src/screens/Home';
import InboxScreen from './src/screens/Inbox';
import NotificationsScreen from './src/screens/Notifications';
import ProfileScreen from './src/screens/Profile';

import DormDetailsComponent from './src/components/DormDetails';

import ChatRoomComponent from './src/components/ChatRoom';

import EditProfileComponent from './src/components/profileScreen/EditProfile';
import ChangePasswordComponent from './src/components/profileScreen/ChangePassword';
import PaymentGatewayComponent from './src/components/profileScreen/PaymentGateway';
import VerificationComponent from './src/components/profileScreen/Verification';
import DormListingComponent from './src/components/profileScreen/DormListing';
import ListingFormComponent from './src/components/ListingForm';
import GuestModeModal from './src/components/modals/GuestModeModal';

import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import SplashScreen from './src/screens/SplashScreen';

import {LogBox} from 'react-native';
import {useEffect} from 'react';
import {BASE_URL} from './constants/index';
import axios from 'axios';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs([/Warning: /]);

const toastConfig = {
  // Success Toast
  success: props => (
    <SuccessToast
      {...props}
      style={{borderLeftColor: '#00C851', elevation: 50}}
      text1Style={{
        fontSize: 16,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  /* Error Toast */
  error: props => (
    <ErrorToast
      {...props}
      style={{borderLeftColor: '#ff4444', elevation: 50}}
      text1Style={{
        fontSize: 16,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  /* Info Toast */
  info: props => (
    <InfoToast
      {...props}
      style={{borderLeftColor: '#33b5e5', elevation: 50}}
      text1Style={{
        fontSize: 16,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
  /* Warning Toast */
  warning: props => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#ffbb33', elevation: 50}}
      text1Style={{
        fontSize: 16,
      }}
      text2Style={{
        fontSize: 12,
      }}
    />
  ),
};

const Tab = createBottomTabNavigator();

function RootNavigator({route}) {
  const {user, mode} = route.params;
  return (
    <Tab.Navigator
      initialRouteName={'ExploreTab'}
      screenOptions={({route, navigation}) => ({
        headerRight: () => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          return routeName === 'Profile' ? null : (
            <TouchableOpacity
              onPress={() => {
                if (mode === 'guest') {
                  navigation.navigate('Guest Modal');
                } else {
                  navigation.navigate('Profile Tab');
                }
              }}>
              <Icon name="account-circle" size={40} color="gray" />
            </TouchableOpacity>
          );
        },
        tabBarIcon: ({color, size}) => {
          let iconName;

          if (route.name === 'ExploreTab') {
            iconName = 'explore';
          } else if (route.name === 'BookmarksTab') {
            iconName = 'bookmark';
          } else if (route.name === 'NotificationsTab') {
            iconName = 'notifications';
          } else if (route.name === 'InboxTab') {
            iconName = 'mail';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0E898B',
        tabBarInactiveTintColor: 'gray',
        headerRightContainerStyle: {paddingRight: 16},
      })}>
      <Tab.Screen
        name="ExploreTab"
        component={HomeScreen}
        options={{title: 'Explore'}}
        initialParams={{user}}
      />
      <Tab.Screen
        name="BookmarksTab"
        component={BookmarksScreen}
        options={{title: 'Bookmarks'}}
        initialParams={{user}}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (mode === 'guest') {
              e.preventDefault();
              navigation.navigate('Guest Modal');
            }
          },
        })}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
        initialParams={{user}}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (mode === 'guest') {
              e.preventDefault();
              navigation.navigate('Guest Modal');
            }
          },
        })}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxScreen}
        options={{title: 'Inbox'}}
        initialParams={{user}}
        listeners={({navigation}) => ({
          tabPress: e => {
            if (mode === 'guest') {
              e.preventDefault();
              navigation.navigate('Guest Modal');
            }
          },
        })}
      />
    </Tab.Navigator>
  );
}

const AppStack = createNativeStackNavigator();

function RootApp({user, mode, verified, onLogout}) {
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Home"
        component={RootNavigator}
        options={{headerShown: false}}
        initialParams={{user, mode}}
      />
      <AppStack.Screen
        name="Change Password"
        component={ChangePasswordComponent}
        initialParams={{user}}
      />
      <AppStack.Screen
        name="Dorm Listing"
        component={DormListingComponent}
        initialParams={{user, verified}}
      />
      <AppStack.Screen
        name="Verification"
        component={VerificationComponent}
        initialParams={{user}}
      />
      <AppStack.Screen name="Guest Modal" options={{headerShown: false}}>
        {() => <GuestModeModal onLogout={onLogout} />}
      </AppStack.Screen>
      <AppStack.Screen name="Profile Tab" options={{title: 'Profile'}}>
        {() => (
          <ProfileScreen user={user} verified={verified} onLogout={onLogout} />
        )}
      </AppStack.Screen>
      <AppStack.Screen name="Edit Profile">
        {() => <EditProfileComponent user={user} onLogout={onLogout} />}
      </AppStack.Screen>
      <AppStack.Screen name="Chat Room" component={ChatRoomComponent} />
      <AppStack.Screen name="Payments" component={PaymentGatewayComponent} />
      <AppStack.Screen name="Dorm Details" component={DormDetailsComponent} />
      <AppStack.Screen name="Listing Form" component={ListingFormComponent} />
    </AppStack.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [verified, setVerified] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mode, setMode] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async user => {
    try {
      AsyncStorage.setItem('user', JSON.stringify(user)).then(() => {
        console.log('login user:', user);
        setUser(user.id);
        setMode(user.mode);
        if (user.mode === 'user') {
          fetchVerification(user.id);
        }
      });
      setMode(user.mode);
    } catch (error) {
      console.log('Login Failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear().then(() => {
        setUser(null);
        setVerified(null);
        setMode('');
      });
    } catch (error) {
      console.log('Logout failed:', error);
    }
  };

  const checkLoginStatus = async () => {
    try {
      await AsyncStorage.getItem('user').then(data => {
        if (data) {
          console.log('async logged user:', data);
          const asyncUser = JSON.parse(data);
          setUser(asyncUser.id);
          setMode(asyncUser.mode);
          if (asyncUser.mode === 'user') {
            fetchVerification(asyncUser.id);
          }
        }
      });
    } catch (error) {
      console.error('Error checking login status:', error);
    } finally {
      setInterval(() => {
        setIsLoading(false);
      }, 3000);
    }
  };

  const fetchVerification = uid => {
    axios
      .get(`${BASE_URL}?tag=get_verification_status&userref=${uid}`)
      .then(async response => {
        const data = JSON.parse(response.data);
        const fetchedStatus = data.is_verified;
        AsyncStorage.setItem(
          'verification',
          JSON.stringify(fetchedStatus),
        ).then(() => {
          console.log('fethched:', fetchedStatus);
          setVerified(Boolean(fetchedStatus));
        });
      });
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          {user ? (
            <Stack.Screen
              name="App"
              options={{
                headerShown: false,
                animation: 'flip',
                animationTypeForReplace: user === null ? 'pop' : 'push',
              }}>
              {() => (
                <RootApp
                  user={user}
                  mode={mode}
                  verified={verified}
                  onLogout={handleLogout}
                />
              )}
            </Stack.Screen>
          ) : (
            <>
              <Stack.Screen
                name="Login"
                options={{
                  headerShown: false,
                  animation: 'slide_from_left',
                  animationTypeForReplace: user === null ? 'pop' : 'push',
                  presentation: 'formSheet',
                }}>
                {() => <Login onLogin={handleLogin} />}
              </Stack.Screen>
              <Stack.Screen
                name="Signup"
                component={SignUp}
                options={{
                  headerShown: false,
                  animation: 'slide_from_right',
                  animationTypeForReplace: 'push',
                  presentation: 'formSheet',
                }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

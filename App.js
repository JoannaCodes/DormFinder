/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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

import Login from './src/screens/Login';
import SignUp from './src/screens/SignUp';
import SplashScreen from './src/screens/SplashScreen';

import {LogBox} from 'react-native';
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
  const {uid} = route.params;
  return (
    <Tab.Navigator
      initialRouteName={'ExploreTab'}
      screenOptions={({route, navigation}) => ({
        headerRight: () => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          return routeName === 'Profile' ? null : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile Tab')}>
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
      />
      <Tab.Screen
        name="BookmarksTab"
        component={BookmarksScreen}
        options={{title: 'Bookmarks'}}
        initialParams={{uid}}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
        initialParams={{uid}}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxScreen}
        options={{title: 'Inbox'}}
        initialParams={{uid}}
      />
    </Tab.Navigator>
  );
}

const AppStack = createNativeStackNavigator();

function RootApp({route}) {
  const {uid} = route.params;
  return (
    <AppStack.Navigator>
      <AppStack.Screen
        name="Home"
        component={RootNavigator}
        options={{headerShown: false}}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Profile Tab"
        component={ProfileScreen}
        options={{title: 'Profile'}}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Chat Room"
        component={ChatRoomComponent}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Edit Profile"
        component={EditProfileComponent}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Change Password"
        component={ChangePasswordComponent}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Dorm Listing"
        component={DormListingComponent}
        initialParams={{uid}}
      />
      <AppStack.Screen
        name="Verification"
        component={VerificationComponent}
        initialParams={{uid}}
      />
      <AppStack.Screen name="Payments" component={PaymentGatewayComponent} />
      <AppStack.Screen name="Dorm Details" component={DormDetailsComponent} />
      <AppStack.Screen name="Listing Form" component={ListingFormComponent} />
    </AppStack.Navigator>
  );
}

const AuthStack = createNativeStackNavigator();

function Auth() {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          animation: 'slide_from_left',
          animationTypeForReplace: 'push',
          presentation: 'formSheet',
        }}
      />
      <AuthStack.Screen
        name="Signup"
        component={SignUp}
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          animationTypeForReplace: 'push',
          presentation: 'formSheet',
        }}
      />
    </AuthStack.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App() {
  const [uid, setUid] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user_data').then(userData => {
      const storedUser = JSON.parse(userData);
      if (storedUser) {
        setUid(storedUser.id);
      }
    });
  }, []);

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={RootApp}
            options={{headerShown: false}}
            initialParams={{uid}}
          />
          <Stack.Screen
            name="Authentication"
            component={Auth}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}

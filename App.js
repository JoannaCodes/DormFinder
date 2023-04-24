import * as React from 'react';
import {Button} from 'react-native';
import {
  getFocusedRouteNameFromRoute,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

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

import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs([/Warning: /]);

const Tab = createBottomTabNavigator();

function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={'ExploreTab'}
      screenOptions={({route, navigation}) => ({
        tabBarButton: ['ProfileTab'].includes(route.name)
          ? () => null
          : undefined,
        headerRight: () => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? '';
          return routeName === 'Profile' ? null : (
            <Button
              onPress={() =>
                navigation.navigate('ProfileTab', {
                  screen: 'Profile',
                })
              }
              title="Profile"
            />
          );
        },
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
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsScreen}
        options={{title: 'Notifications'}}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxScreen}
        options={{title: 'Inbox'}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={RootNavigator}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Dorm Details" component={DormDetailsComponent} />
        <Stack.Screen name="Chat Room" component={ChatRoomComponent} />
        <Stack.Screen name="Edit Profile" component={EditProfileComponent} />
        <Stack.Screen
          name="Change Password"
          component={ChangePasswordComponent}
        />
        <Stack.Screen name="Dorm Listing" component={DormListingComponent} />
        <Stack.Screen name="Payments" component={PaymentGatewayComponent} />
        <Stack.Screen name="Verification" component={VerificationComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

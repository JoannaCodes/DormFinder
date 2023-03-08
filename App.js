import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
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
import {Button} from 'react-native';

const uid = 12345;

const HomeStack = createNativeStackNavigator();

function HomeStackScreen({navigation}) {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate('ProfileTab')}
            title="Profile"
          />
        ),
      }}>
      <HomeStack.Screen name="Explore" component={HomeScreen} />
      <HomeStack.Screen name="Dorm Details" component={DormDetailsComponent} />
    </HomeStack.Navigator>
  );
}

const BookmarksStack = createNativeStackNavigator();

function BookmarksStackScreen({navigation}) {
  return (
    <BookmarksStack.Navigator
      screenOptions={{
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate('ProfileTab')}
            title="Profile"
          />
        ),
      }}>
      <BookmarksStack.Screen name="Bookmarks" component={BookmarksScreen} />
      <BookmarksStack.Screen
        name="Dorm Details"
        component={DormDetailsComponent}
      />
    </BookmarksStack.Navigator>
  );
}

const NotificationsStack = createNativeStackNavigator();

function NotificationsStackScreen({navigation}) {
  return (
    <NotificationsStack.Navigator
      screenOptions={{
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate('ProfileTab')}
            title="Profile"
          />
        ),
      }}>
      <NotificationsStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
    </NotificationsStack.Navigator>
  );
}

const InboxStack = createNativeStackNavigator();

function InboxStackScreen({navigation}) {
  return (
    <InboxStack.Navigator
      screenOptions={{
        headerRight: () => (
          <Button
            onPress={() => navigation.navigate('ProfileTab')}
            title="Profile"
          />
        ),
      }}>
      <InboxStack.Screen name="Inbox" component={InboxScreen} />
      <InboxStack.Screen name="Chat Room" component={ChatRoomComponent} />
    </InboxStack.Navigator>
  );
}

const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{userId: uid}}
      />
      <ProfileStack.Screen
        name="Edit Profile"
        component={EditProfileComponent}
      />
      <ProfileStack.Screen
        name="Change Password"
        component={ChangePasswordComponent}
      />
      <ProfileStack.Screen
        name="Payments"
        component={PaymentGatewayComponent}
      />
      <ProfileStack.Screen
        name="Verification"
        component={VerificationComponent}
      />
    </ProfileStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function RootNavigator() {
  return (
    <Tab.Navigator
      initialRouteName={'ExploreTab'}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarButton: ['ProfileTab'].includes(route.name)
          ? () => null
          : undefined,
      })}>
      <Tab.Screen
        name="ExploreTab"
        component={HomeStackScreen}
        options={{title: 'Explore'}}
      />
      <Tab.Screen
        name="BookmarksTab"
        component={BookmarksStackScreen}
        options={{title: 'Bookmarks'}}
      />
      <Tab.Screen
        name="NotificationsTab"
        component={NotificationsStackScreen}
        options={{title: 'Notifications'}}
      />
      <Tab.Screen
        name="InboxTab"
        component={InboxStackScreen}
        options={{title: 'Inbox'}}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStackScreen}
        options={{title: 'Profile'}}
      />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;

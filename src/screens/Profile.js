/* eslint-disable react-native/no-inline-styles */
import {View, Button, Text} from 'react-native';
import React from 'react';

const Profile = ({route, navigation}) => {
  const uid = route.params.userId;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>UID: {uid}</Text>
      <Button
        title="Go to Edit Profile"
        onPress={() => navigation.navigate('Edit Profile')}
      />
      <Button
        title="Go to Change Password"
        onPress={() => navigation.navigate('Change Password')}
      />
      <Button
        title="Go to Verification"
        onPress={() => navigation.navigate('Verification', {userId: uid})}
      />
      <Button
        title="Go to Payments"
        onPress={() => navigation.navigate('Payments')}
      />
    </View>
  );
};

export default Profile;

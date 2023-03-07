/* eslint-disable react-native/no-inline-styles */
import {View, Text, Button} from 'react-native';
import React from 'react';

const Inbox = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Inbox</Text>
      <Button
        title="Go to Chat Room"
        onPress={() => navigation.navigate('Chat Room')}
      />
    </View>
  );
};

export default Inbox;

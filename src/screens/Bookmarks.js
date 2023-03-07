/* eslint-disable react-native/no-inline-styles */
import {View, Text, Button} from 'react-native';
import React from 'react';

const Bookmarks = ({navigation}) => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Bookmarks</Text>
      <Button
        title="Go to Dorm Details"
        onPress={() => navigation.navigate('Dorm Details')}
      />
    </View>
  );
};

export default Bookmarks;

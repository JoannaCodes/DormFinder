/* eslint-disable react-native/no-inline-styles */
import {View, Text} from 'react-native';
import React from 'react';

const Verification = ({route}) => {
  const uid = route.params.userId;

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Verification - UID: {uid}</Text>
    </View>
  );
};

export default Verification;

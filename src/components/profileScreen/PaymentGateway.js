/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {goToAppSettings, openInStore} from 'react-native-app-link';

import COLORS from '../../../constants/colors';

export default function PaymentGateway({navigation}) {
  const openGCashApp = () => {
    openInStore({
      appName: 'GCash',
      playStoreId: 'com.globe.gcash.android',
    }).catch(() => {
      Alert.alert(
        'GCash Not Found',
        'The GCash app is not installed on your device. Would you like to install it?',
        [
          {text: 'No', style: 'cancel'},
          {text: 'Yes', onPress: () => goToAppSettings()},
        ],
      );
    });
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/payment_upsketch.png')}
        style={{height: 360, width: 360}}
        resizeMode="cover"
      />
      <Text style={styles.title}>We are redirecting you to your GCash App</Text>
      <Text style={styles.text}>
        Once payment transaction is done, send your reciept to the dorm owner
      </Text>
      <TouchableOpacity style={styles.button} onPress={openGCashApp}>
        <Text style={{color: COLORS.white}}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 11,
    marginTop: 20,
  },
});

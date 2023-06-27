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
import {GooglePay} from 'react-native-google-pay';

import COLORS from '../../../constants/colors';

const allowedCardNetworks = ['AMEX', 'VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

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
        Once payment transaction is done, send your receipt to the dorm owner.
      </Text>
      <TouchableOpacity style={styles.button} onPress={openGCashApp}>
        <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold'}}>
          Continue with Gcash
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const requestData = {
            cardPaymentMethod: {
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                gateway: 'example',
                gatewayMerchantId: 'BCR2DN4TZDILX3ZX',
              },
              allowedCardNetworks,
              allowedCardAuthMethods,
            },
            transaction: {
              totalPrice: '2500',
              totalPriceStatus: 'FINAL',
              currencyCode: 'PHP',
            },
            merchantName: 'PeekABook Online Consultation',
          };

          // Set the environment before the payment request
          GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);

          // Check if Google Pay is available
          GooglePay.isReadyToPay(
            allowedCardNetworks,
            allowedCardAuthMethods,
          ).then(ready => {
            if (ready) {
              // Request payment token
              GooglePay.requestPayment(requestData)
                .then(async token => {
                  Alert.alert('Success');
                })
                .catch(error => {
                  Alert.alert('Transaction Cancel');
                });
            }
          });
        }}>
        <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold'}}>
          Continue with Google Pay
        </Text>
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
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 8,
    marginTop: 20,
  },
});

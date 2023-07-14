/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {goToAppSettings, openInStore} from 'react-native-app-link';
import {GooglePay} from 'react-native-google-pay';

import COLORS from '../../../constants/colors';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {BASE_URL, AUTH_KEY} from '../../../constants';

const Separator = ({title}) => {
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text
        style={{
          marginHorizontal: 5,
          color: 'gray',
          fontFamily: 'Poppins-SemiBold',
        }}>
        {title}
      </Text>
      <View style={styles.line} />
    </View>
  );
};

const allowedCardNetworks = ['AMEX', 'VISA', 'MASTERCARD'];
const allowedCardAuthMethods = ['PAN_ONLY', 'CRYPTOGRAM_3DS'];

export default function PaymentGateway({route, navigation}) {
  const {userref, ownerref, ownername, dormref, price, advance, security} = route.params;
  const [count, setCount] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const addonAmount =
    parseInt(price, 10) +
    parseInt(advance ? advance : 0, 10) +
    parseInt(security ? security : 0, 10);

  const origamount = parseInt(price, 10);

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

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `${BASE_URL}?tag=get_transactions&userref=${userref}&is_owner=${false}`,
        {
          headers: {
            'Auth-Key': AUTH_KEY,
          },
        },
      )
      .then(response => {
        const data = JSON.parse(response.data);
        setCount(data);
      })
      .catch(async error => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../../../assets/payment_upsketch.png')}
          style={{height: 270, width: 270}}
          resizeMode="cover"
        />
      </View>
      <View
        style={{
          borderStyle: 'dashed',
          borderRadius: 20,
          borderWidth: 1,
          padding: 16,
          marginBottom: 20,
        }}>
        <Text style={styles.heading}>Payment Details</Text>
        <Text style={styles.text}>Receiver: {ownername}</Text>
        <Text style={styles.text}>
          Amount:{' '}
          {isLoading
            ? 'Loading...'
            : `₱${count.length >= 1 ? origamount : addonAmount}.00`}
        </Text>
        <View
          style={{
            backgroundColor: COLORS.teal,
            padding: 5,
            borderRadius: 5,
            marginTop: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="info" color={COLORS.white} size={16} />
            <Text
              style={[
                styles.label,
                {fontSize: 12, marginStart: 5, color: COLORS.white},
              ]}>
              For listing that has advance deposits and/or security deposits.
              They will be included for the first payment.
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.button, isLoading && {opacity: 0.5}]}
        disabled={isLoading}
        onPress={() => {
          const requestData = {
            cardPaymentMethod: {
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                gateway: 'example',
                gatewayMerchantId: ownerref,
              },
              allowedCardNetworks,
              allowedCardAuthMethods,
            },
            transaction: {
              totalPrice: price,
              totalPriceStatus: 'FINAL',
              currencyCode: 'PHP',
            },
            merchantName: ownername,
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
                  const formData = new FormData();
                  formData.append('tag', 'payment');
                  formData.append('token', token);
                  formData.append('userref', userref);
                  formData.append(
                    'ownerref',
                    requestData.cardPaymentMethod.tokenizationSpecification
                      .gatewayMerchantId,
                  );
                  formData.append('ownername', requestData.merchantName);
                  formData.append('dormref', dormref);
                  formData.append('amount', requestData.transaction.totalPrice);

                  await axios
                    .post(BASE_URL, formData, {
                      headers: {
                        'Auth-Key': AUTH_KEY,
                        'Content-Type': 'multipart/form-data',
                      },
                    })
                    .then(response => {
                      const message = response.data;

                      if (message === 'success') {
                        Toast.show({
                          type: 'success',
                          text1: 'StudyHive',
                          text2: 'Payment Sucessful',
                        });
                        navigation.goBack();
                      } else {
                        Toast.show({
                          type: 'error',
                          text1: 'StudyHive',
                          text2:
                            'Payment did not push through. Please try again.',
                        });
                      }
                    })
                    .catch(error => {
                      console.error(
                        'Error occurred during the Axios request:',
                        error,
                      );
                      Toast.show({
                        type: 'error',
                        text1: 'StudyHive',
                        text2: 'An error occured',
                      });
                    });
                })
                .catch(error => {
                  Toast.show({
                    type: 'error',
                    text1: 'StudyHive',
                    text2: 'Transaction Cancelled',
                  });
                });
            }
          });
        }}>
        <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold'}}>
          Continue with Google Pay
        </Text>
      </TouchableOpacity>
      <Separator title={'Or'} />
      <TouchableOpacity style={styles.button} onPress={openGCashApp}>
        <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold'}}>
          Continue with GCash
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: COLORS.white,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'gray',
  },
  heading: {
    fontSize: 20,
    marginBottom: 5,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Poppins-Regular',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 8,
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import {goToAppSettings, openInStore} from 'react-native-app-link';
import {GooglePay} from 'react-native-google-pay';
import Icon from 'react-native-vector-icons/MaterialIcons';

import COLORS from '../../../constants/colors';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {BASE_URL, AUTH_KEY} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const {payor, merchant, merchantid, price} = route.params;
  const [history, setHistory] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('success');

  useEffect(async () => {
    fetchData();
  }, []);

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

  const fetchData = async () => {
    await axios
      .get(`${BASE_URL}?tag=get_transactions&userref=${payor}`, {
        headers: {
          'Auth-Key': AUTH_KEY,
        },
      })
      .then(response => {
        const data = JSON.parse(response.data);
        setHistory(data);

        AsyncStorage.setItem('transactions', JSON.stringify(data));
      })
      .catch(async error => {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          setHistory(JSON.parse(storedTransactions));
        } else {
          setStatus('failed');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.transaction}>
        <Text style={styles.title}>{item.token}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.amount}>₱{item.price}</Text>
          <Text style={styles.date}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          borderStyle: 'dashed',
          borderRadius: 20,
          borderWidth: 1,
          padding: 16,
          marginBottom: 20,
        }}>
        <Text style={styles.heading}>Payment Details</Text>
        <Text style={styles.text}>Receiver: {merchant}</Text>
        <Text style={styles.text}>Amount: ₱ {price}</Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          const requestData = {
            cardPaymentMethod: {
              tokenizationSpecification: {
                type: 'PAYMENT_GATEWAY',
                gateway: 'example',
                gatewayMerchantId: merchantid,
              },
              allowedCardNetworks,
              allowedCardAuthMethods,
            },
            transaction: {
              totalPrice: price,
              totalPriceStatus: 'FINAL',
              currencyCode: 'PHP',
            },
            merchantName: merchant,
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
                  formData.append('payor', payor); // sender
                  formData.append(
                    'merchant',
                    requestData.cardPaymentMethod.tokenizationSpecification
                      .gatewayMerchantId, // reciever
                  );
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
          Continue with Gcash
        </Text>
      </TouchableOpacity>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 20}}>
        <Icon name="history" size={18} color={COLORS.teal} />
        <Text style={[styles.text, {marginTop: 0, marginStart: 5}]}>
          Transaction History
        </Text>
      </View>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0E898B" />
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => {
            return (
              <View>
                {status === 'failed' ? (
                  <Text style={styles.text}>
                    Cannot retrieve transaction history this time
                  </Text>
                ) : (
                  <Text style={styles.text}>No Transactions</Text>
                )}
              </View>
            );
          }}
          renderItem={renderItem}
          ItemSeparatorComponent={() => {
            return <View style={{backgroundColor: COLORS.grey, height: 1}} />;
          }}
        />
      )}
    </View>
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
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
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
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transaction: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 16,
    marginBottom: 6,
    fontFamily: 'Poppins-Regular',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
  date: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import COLORS from '../../../constants/colors';
import axios from 'axios';
import {BASE_URL, AUTH_KEY} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PaymentGateway({route, navigation}) {
  const {user} = route.params;
  const [history, setHistory] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('success');

  useEffect(async () => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get(`${BASE_URL}?tag=get_transactions&userref=${user}`, {
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
        <Text style={styles.title}>{item.dorm}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.amount}>₱ {item.price}</Text>
          <Text style={styles.date}>{item.timestamp}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
          contentContainerStyle={styles.cardContainer}
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
  cardContainer: {
    flexGrow: 1,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    fontFamily: 'Poppins-Regular',
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

<<<<<<< HEAD
=======
/* eslint-disable eqeqeq */
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
<<<<<<< HEAD
=======
  TouchableOpacity,
  RefreshControl,
  Image,
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import COLORS from '../../../constants/colors';
import axios from 'axios';
<<<<<<< HEAD
import {BASE_URL, AUTH_KEY} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

=======
import {BASE_URL, DORM_UPLOADS, AUTH_KEY} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ReviewForm from '../../components/ReviewForm';

>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
export default function PaymentGateway({route, navigation}) {
  const {user} = route.params;
  const [history, setHistory] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('success');
<<<<<<< HEAD
=======
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('');
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9

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
<<<<<<< HEAD
=======
        console.log(data);
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9

        AsyncStorage.setItem('transactions', JSON.stringify(data));
      })
      .catch(async error => {
<<<<<<< HEAD
=======
        console.log(error);
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
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
<<<<<<< HEAD
    return (
      <View style={styles.transaction}>
        <Text style={styles.title}>{item.token}</Text>
        <View style={styles.rowContainer}>
          <Text style={styles.amount}>₱ {item.price}</Text>
          <Text style={styles.date}>{item.timestamp}</Text>
        </View>
=======
    const images = item.images ? item.images.split(',') : [];

    return (
      <View
        style={{
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.grey,
        }}>
        <View style={styles.card}>
          <Image
            source={{
              uri: `${DORM_UPLOADS}/${item.dormref}/${images[0]}`,
            }}
            style={styles.cardImage}
          />
          <View style={styles.transaction}>
            <Text style={[styles.title, {fontFamily: 'Poppins-Bold'}]}>
              {item.token}
            </Text>
            <View style={styles.rowContainer}>
              <Text style={styles.amount}>₱ {item.amount}</Text>
              <Text style={styles.amount}>{item.ownername}</Text>
            </View>
            <Text style={styles.date}>{item.timestamp}</Text>
          </View>
        </View>
        {item.has_reviewed == '1' ? null : (
          <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
              setModalVisible(true);
              setSelectedDorm(item.dormref);
            }}>
            <Icon name="star-rate" size={18} color={COLORS.teal} />
            <Text
              style={{
                marginStart: 5,
                fontFamily: 'Poppins-Regular',
                includeFontPadding: false,
                textAlignVertical: 'center',
                color: 'black',
              }}>
              Write a review
            </Text>
          </TouchableOpacity>
        )}
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
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
<<<<<<< HEAD
          ItemSeparatorComponent={() => {
            return <View style={{backgroundColor: COLORS.grey, height: 1}} />;
          }}
        />
      )}
=======
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={isLoading}
              onRefresh={fetchData}
            />
          }
        />
      )}
      <ReviewForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userref={user}
        dormref={selectedDorm}
        onSubmit={fetchData}
      />
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
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
<<<<<<< HEAD
=======
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 100,
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
    borderRadius: 5,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.teal,
    padding: 5,
    marginVertical: 5,
  },
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
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
<<<<<<< HEAD
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
=======
    flex: 4,
    paddingHorizontal: 16,
>>>>>>> 16261128c79f7262fa2bd2f006d9f973000ff6b9
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

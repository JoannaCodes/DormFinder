/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, DORM_UPLOADS} from '../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ReviewForm from '../components/ReviewForm';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const Bookmarks = ({route, navigation}) => {
  const {user} = route.params;
  let URL = BASE_URL;

  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('');
  const [status, setStatus] = useState('success');
  const [dorms, setDorms] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await axios
      .get(`${URL}?tag=get_bookmarks&userref=${user}`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        setStatus('success');

        const dataWithoutImages = data.map(item => {
          const {images, ...rest} = item;
          return rest;
        });
        AsyncStorage.setItem('bookmarks', JSON.stringify(dataWithoutImages));
      })
      .catch(async error => {
        const storedDorms = await AsyncStorage.getItem('bookmarks');
        if (storedDorms) {
          setDorms(JSON.parse(storedDorms));
        } else {
          setStatus('failed');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderItem = ({item}) => {
    const images = item.images ? item.images.split(',') : [];
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        underlayColor="#CCCCCC"
        onPress={() => navigation.navigate('Dorm Details')}>
        <View style={styles.card}>
          <Image
            source={{
              uri: `${DORM_UPLOADS}/${item.dormref}/${images[0]}`,
            }}
            style={styles.cardImage}
          />
          <View style={styles.cardBody}>
            <View style={styles.details}>
              <Text
                style={styles.cardTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.cardText}>₱{item.price}</Text>
            </View>
            <Separator />
            <View style={styles.action}>
              <TouchableOpacity
                style={[styles.btnContainer, {marginEnd: 4}]}
                onPress={() => {
                  setModalVisible(true);
                  setSelectedDorm(item.dormref);
                  // console.log(item.dormref);
                }}>
                <Icon name="star-rate" size={18} color="#0E898B" />
                <Text style={{marginLeft: 10}}>Write a review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnContainer, {marginStart: 4}]}
                onPress={() => navigation.navigate('Chat Room')}>
                <Icon name="message" size={18} color="#0E898B" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'failed' ? (
          <>
            <Image
              source={require('../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>
              Cannot retrieve bookmarks at this time. Please try again later.
            </Text>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setLoading(true);
                fetchData();
              }}>
              <Text>Try Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/empty_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text>Tap "</Text>
              <Icon name="favorite" size={18} color="red" />
              <Text>" to add the dorm that interests you</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0E898B" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.cardContainer}
          data={dorms}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
          ItemSeparatorComponent={() => {
            return <View style={{flex: 1, height: 16}} />;
          }}
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
      />
    </SafeAreaView>
  );
};

export default Bookmarks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0E898B',
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 150,
    resizeMode: 'cover',
    backgroundColor: '#CCCCCC',
  },
  cardBody: {
    flex: 3,
  },
  details: {
    flex: 4,
    justifyContent: 'space-evenly',
    padding: 8,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardText: {
    fontWeight: 'bold',
  },
});

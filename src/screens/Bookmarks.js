/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, DORM_UPLOADS} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ReviewForm from '../components/ReviewForm';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const Bookmarks = ({navigation}) => {
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('');
  const [status, setStatus] = useState('Success');
  const [dorms, setDorms] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [uid]),
  );

  const fetchData = async () => {
    await axios
      .get(`${URL}?tag=get_bookmarks&userref=${uid}`)
      .then(response => {
        setDorms(JSON.parse(response.data));
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'Network error. Please check your connection and try again',
        });
        setStatus('Failed');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const _deleteBookmark = async dormref => {
    const formData = new FormData();
    formData.append('tag', 'delete_bookmark');
    formData.append('userref', uid);
    formData.append('dormref', dormref);

    await axios
      .post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        Toast.show({
          type: 'success',
          text1: 'Dorm Finder',
          text2: response.data,
        });
        setLoading(true);
        fetchData();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: error,
        });
      });
  };

  const renderItem = ({item}) => {
    const images = item.images.split(',');
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
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.price}</Text>
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
              <TouchableOpacity style={[styles.btnContainer, {marginStart: 4}]}>
                <Icon name="message" size={18} color="#0E898B" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.btnContainer}
                onPress={() => {
                  _deleteBookmark(item.dormref);
                }}>
                <Icon name="delete" size={18} color="#0E898B" />
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'Failed' ? (
          <>
            <Image
              source={require('../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>Network Error</Text>
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text>Tap "❤️" to add the dorm that interests you</Text>
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
          contentContainerStyle={{flexGrow: 1}}
          data={dorms}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
        />
      )}
      <ReviewForm
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        userref={uid}
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
    padding: 8,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
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
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    margin: 8,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 150,
    resizeMode: 'cover',
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

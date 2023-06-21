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
import {useFocusEffect} from '@react-navigation/native';
import COLORS from '../../constants/colors';

import ReviewForm from '../components/ReviewForm';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={COLORS.grey} />;
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

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      return () => {
        // Clean up any resources if needed
      };
    }, []),
  );

  const fetchData = async () => {
    await axios
      .get(`${URL}?tag=get_bookmarks&userref=${user}`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        setStatus('failed');

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
        underlayColor={COLORS.grey}
        onPress={() =>
          navigation.navigate('Dorm Details', {
            dormref: item.dormref,
            userref: user,
          })
        }>
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
                }}>
                <Icon name="star-rate" size={18} color={COLORS.teal} />
                <Text style={{marginLeft: 10}}>Write a review</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnContainer, {marginStart: 4}]}
                onPress={() => navigation.navigate('Chat Room')}>
                <Icon name="message" size={18} color={COLORS.teal} />
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
            <Text style={styles.title}>
              Cannot retrieve bookmarks at this time.
            </Text>
            <Text style={styles.message}>Please try again.</Text>
            <TouchableOpacity
              style={[styles.btnContainer, {marginTop: 20, width: '100%'}]}
              onPress={() => {
                setLoading(true);
                fetchData();
              }}>
              <Text>Retry</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/empty_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>Add Bookmarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.message}>Tap "</Text>
              <Icon name="favorite" size={18} color={COLORS.red} />
              <Text style={styles.message}>
                " to add the dorm that interests you
              </Text>
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
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
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
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 150,
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
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

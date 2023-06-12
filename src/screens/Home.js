/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  View,
  Text,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
  Pressable,
  Linking,
  PermissionsAndroid,
} from 'react-native';

import Geolocation from '@react-native-community/geolocation';

import axios from 'axios';
import { BASE_URL, DORM_UPLOADS } from '../../constants/index';

import PushNotificationConfig from '../components/PushNotificationConfig';
import PushNotification, { Importance } from 'react-native-push-notification';

import COLORS from '../consts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width } = Dimensions.get('screen');
import houses from '../consts/houses';

import Drawer from '../components/drawer';

const HomeScreen = ({ navigation }) => {
  PushNotificationConfig.configure();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategoryIndex === 0) {
      fetchDormsByCategory('popular_dorm');
    } else if (selectedCategoryIndex === 1) {
      fetchDormsByCategory('latest_dorm');
    } else if (selectedCategoryIndex === 2) {
      fetchDormsByCategory('nearest_dorm');
    }
  }, [selectedCategoryIndex]);

  const _fetchNotif = () => {
    let URL = BASE_URL;
    axios.get(URL + '?tag=fetch_saved_notif').then(res => {
      console.log(res.data);
      var output = JSON.parse(res.data);
      let testx = '';
      try {
        if (output.length !== 0) {
          for (var key in output) {
            let test = output[key].scheduled;
            if (test !== '' || test !== null) {
              var javascript_date = new Date(Date.parse(test));
              var unix = javascript_date.getTime() / 1000;
              PushNotification.localNotificationSchedule({
                id: output[key].unix_time,
                title: 'DormFinder',
                message: output[key].ndesc,
                channelId: 'channel-id',
                date: new Date(unix * 1000),
                allowWhileIdle: true,
              });
            }
          }
        }
      } catch (error) {
        console.log('error:' + error);
      }
    });
  };

  const [dorms, setDorms] = useState([]);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const fetchData = () => {
    axios
      .get(`${BASE_URL}?tag=popular_dorm`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchDormsByCategory = async (tag) => {
    if (tag === 'nearest_dorm') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
  
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, fetch dorms based on user's location
          Geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              const formData = new FormData();
              formData.append('tag', 'nearest_dorm');
              formData.append('latitude', latitude);
              formData.append('longitude', longitude);
  
              try {
                const response = await axios.post(`${BASE_URL}?tag=${tag}`, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                });
                const data = JSON.parse(response.data);
                setDorms(data);
                setSelectedCategoryIndex(
                  categoryList.findIndex(category => category.tag === tag)
                );
              } catch (error) {
                console.error(error);
              }
            },
            (error) => {
              console.log('Error getting current position:', error);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
          );
        } else {
          // Permission denied, display modal to turn on location settings
          Alert.alert(
            'Location Permission',
            'Please enable location services to show nearest dorms.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Settings',
                onPress: () => Linking.openSettings(),
              },
            ]
          );
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    } else {
      // Fetch dorms for other categories
      axios
        .get(`${BASE_URL}?tag=${tag}`, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          const data = JSON.parse(response.data);
          setDorms(data);
          setSelectedCategoryIndex(
            categoryList.findIndex(category => category.tag === tag)
          );
        })
        .catch(error => {
          console.error(error);
        });
    }
  };

  const categoryList = [
    { name: 'Popular', tag: 'popular_dorm' },
    { name: 'Latest', tag: 'latest_dorm' },
    { name: 'Nearest', tag: 'nearest_dorm' },
  ];

  const ListCategories = () => {
    return (
      <View style={styles.categoryListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => fetchDormsByCategory(category.tag)}>
            <Text
              style={[
                styles.categoryListText,
                index === selectedCategoryIndex && styles.activeCategoryListText,
              ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const Card = ({ item }) => {
    const images = item.images ? item.images.split(',') : [];
    return (
      <Pressable
        activeOpacity={0.8}
        onPress={() => navigation.navigate('Dorm Details', {dormref:item.id})}>
        <View style={styles.card}>
          <Image
            source={{ uri: `${DORM_UPLOADS}/${item.id}/${images[0]}` }}
            style={styles.cardImage}
          />
          <View style={{ marginTop: 10 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                {item.name}
              </Text>
              <Text
                style={{ fontWeight: 'bold', color: COLORS.teal, fontSize: 16 }}>
                ₱{item.price}
              </Text>
            </View>
            <Text style={{ color: COLORS.grey, fontSize: 14, marginTop: 5 }}>
              {item.address}
            </Text>
            <View style={{ marginTop: 10, flexDirection: 'row' }}>
              <View style={styles.facility}>
                <Icon name="hotel" size={18} />
                <Text style={styles.facilityText}>2</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="bathtub" size={18} />
                <Text style={styles.facilityText}>2</Text>
              </View>
              <View style={styles.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={styles.facilityText}>100m</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: COLORS.white, flex: 1 }}>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <View>
          <Text style={{ color: COLORS.grey }}>Location</Text>
          <Text style={{ color: COLORS.teal, fontSize: 20, fontWeight: 'bold' }}>
            Manila, Philippines
          </Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" color={COLORS.grey} size={25} />
          <TextInput placeholder="Search address, city, location" />
        </View>
        <TouchableOpacity onPress={() => console.log('Sort button pressed')}>
          <View style={styles.sortBtn}>
            <Icon name="tune" color={COLORS.white} size={25} />
          </View>
        </TouchableOpacity>
      </View>
      <ListCategories />
      <FlatList
        snapToInterval={width - 20}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingLeft: 20, paddingVertical: 20 }}
        horizontal={false}
        data={dorms}
        ListHeaderComponent={() => <View></View>}
        renderItem={Card}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  profileImage: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  searchInputContainer: {
    height: 50,
    backgroundColor: COLORS.light,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  sortBtn: {
    backgroundColor: COLORS.teal,
    height: 50,
    width: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  optionsCard: {
    height: 210,
    width: width / 2 - 30,
    elevation: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  optionsCardImage: {
    height: 140,
    borderRadius: 10,
    width: '100%',
  },
  optionListsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  categoryListText: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingBottom: 5,
    color: COLORS.grey,
  },
  activeCategoryListText: {
    color: COLORS.teal,
    borderBottomWidth: 1,
    paddingBottom: 5,
  },
  categoryListContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 40,
  },
  card: {
    height: 300,
    backgroundColor: COLORS.white,
    elevation: 10,
    width: width - 40,
    marginRight: 20,
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },
  facility: { flexDirection: 'row', marginRight: 15 },
  facilityText: { marginLeft: 5, color: COLORS.grey },
});

export default HomeScreen;

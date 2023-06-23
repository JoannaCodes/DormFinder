/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Dimensions,
  StatusBar,
  Pressable,
  Linking,
  PermissionsAndroid,
  LogBox,
} from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs([/Warning: /]);
LogBox.ignoreLogs(['Please report: ...']);
LogBox.ignoreLogs([/Please report: /]);
LogBox.ignoreLogs(['AsyncStorage ...']);
LogBox.ignoreLogs([/AsyncStorage /]);

import Geolocation from '@react-native-community/geolocation';

import axios from 'axios';
import {API_URL, BASE_URL, DORM_UPLOADS, AUTH_KEY} from '../../constants/index';

import PushNotificationConfig from '../components/PushNotificationConfig';
import PushNotification, {Importance} from 'react-native-push-notification';

import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get('screen');
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Toast from 'react-native-toast-message';

const HomeScreen = ({navigation, route}) => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const [filteredRatings, setFilteredRatings] = useState(0);
  const [filteredMinPrice, setFilteredMinPrice] = useState(0);
  const [filteredMaxPrice, setFilteredMaxPrice] = useState(0);
  const [filteredAircon, setFilteredAircon] = useState(0);
  const [filteredElevator, setFilteredElevator] = useState(0);
  const [filteredBeddings, setFilteredBeddings] = useState(0);
  const [filteredKitchen, setFilteredKitchen] = useState(0);
  const [filteredLaundry, setFilteredLaundry] = useState(0);
  const [filteredLounge, setFilteredLounge] = useState(0);
  const [filteredParking, setFilteredParking] = useState(0);
  const [filteredSecurity, setFilteredSecurity] = useState(0);
  const [filteredStudyRoom, setFilteredStudyRoom] = useState(0);
  const [filteredWifi, setFilteredWifi] = useState(0);
  const [filteredPet, setFilteredPet] = useState(0);
  const [filteredVisitor, setFilteredVisitor] = useState(0);
  const [filteredCurfew, setFilteredCurfew] = useState(0);

  PushNotification.createChannel(
    {
      channelId: 'channel-id', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: false, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
    },
    created => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );

  PushNotificationConfig.configure();

  const {user, mode} = route.params;

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    var a = filteredAircon;
    var b = filteredElevator;
    var c = filteredBeddings;
    var d = filteredKitchen;
    var e = filteredLaundry;
    var f = filteredLounge;
    var g = filteredParking;
    var h = filteredSecurity;
    var i = filteredStudyRoom;
    var j = filteredWifi;
    var k = filteredPet;
    var l = filteredVisitor;
    var m = filteredCurfew;
    var n = filteredRatings;
    var o = filteredMinPrice;
    var p = filteredMaxPrice;

    if (selectedCategoryIndex === 0) {
      _fetchNotif();
      fetchDormsByCategory(
        'popular_dorm',
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p
      );
    } else if (selectedCategoryIndex === 1) {
      fetchDormsByCategory(
        'latest_dorm',
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p
      );
    } else if (selectedCategoryIndex === 2) {
      fetchDormsByCategory(
        'nearest_dorm',
        a,
        b,
        c,
        d,
        e,
        f,
        g,
        h,
        i,
        j,
        k,
        l,
        m,
        n,
        o,
        p
      );
    }
  }, [
    selectedCategoryIndex,
    filteredAircon,
    filteredElevator,
    filteredBeddings,
    filteredKitchen,
    filteredLaundry,
    filteredLounge,
    filteredParking,
    filteredSecurity,
    filteredStudyRoom,
    filteredWifi,
    filteredPet,
    filteredVisitor,
    filteredCurfew,
    filteredRatings,
    filteredMinPrice,
    filteredMaxPrice
  ]);

  const _fetchNotif = async () => {
    try {
      let URL = BASE_URL;
      axios
        .get(URL + '?tag=fetch_saved_notif&user_ref=' + user)
        .then(res => {
          var output = JSON.parse(res.data);
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
        })
        .catch(error => {
          console.log('error:' + error);
        });
    } catch (error) {
      console.log('error:' + error);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDorms, setFilteredDorms] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [modal, setModal] = useState(false);

  const fetchData = async (a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p) => {
    let formdata = new FormData();
    formdata.append('action', 'popular_dorm');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    });

    const json = await response.text();
    if (json.code === 200) {
      setDorms(json.data);
    }
  };

  const fetchDormsByCategory = async (
    tag,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p
  ) => {
    if (tag === 'nearest_dorm') {
      setSelectedCategoryIndex(
        categoryList.findIndex(category => category.tag === tag),
      );
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Permission granted, fetch dorms based on user's location
          Geolocation.getCurrentPosition(
            async position => {
              const {latitude, longitude} = position.coords;

              const formdata = new FormData();
              formdata.append('action', 'nearest_dorm');
              formdata.append('aircon', a ?? 0);
              formdata.append('elevator', b ?? 0);
              formdata.append('beddings', c ?? 0);
              formdata.append('kitchen', d ?? 0);
              formdata.append('laundry', e ?? 0);
              formdata.append('parking', f ?? 0);
              formdata.append('lounge', g ?? 0);
              formdata.append('security', h ?? 0);
              formdata.append('study_room', i ?? 0);
              formdata.append('wifi', j ?? 0);
              formdata.append('pet', k ?? 0);
              formdata.append('visitor', l ?? 0);
              formdata.append('curfew', m ?? 0);
              formdata.append('rating', n ?? 0);
              formdata.append('min_price', o ?? 0);
              formdata.append('max_price', p ?? 0);
              formdata.append('latitude', latitude);
              formdata.append('longitude', longitude);

              const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                  'Auth-Key': AUTH_KEY,
                  'Content-Type': 'multipart/form-data',
                },
                body: formdata,
              });

              const json = await response.json();

              if (json.code === 200) {
                setDorms([]);
                setDorms(json.data);
              } else if (json.code === 403) {
                setDorms([]);
                Toast.show({
                  type: 'error',
                  text1: 'StudyHive',
                  text2: json.data,
                });
              }
            },
            error => {
              console.log('Error getting current position:', error);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
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
                onPress: () => fetchDormsByCategory('popular_dorm'), // Move to popular category if location permission is denied
              },
              {
                text: 'Settings',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      } catch (error) {
        console.log('Error requesting location permission:', error);
      }
    } else {
      let formdata = new FormData();
      formdata.append('action', tag);
      formdata.append('aircon', a ?? 0);
      formdata.append('elevator', b ?? 0);
      formdata.append('beddings', c ?? 0);
      formdata.append('kitchen', d ?? 0);
      formdata.append('laundry', e ?? 0);
      formdata.append('parking', f ?? 0);
      formdata.append('lounge', g ?? 0);
      formdata.append('security', h ?? 0);
      formdata.append('study_room', i ?? 0);
      formdata.append('wifi', j ?? 0);
      formdata.append('pet', k ?? 0);
      formdata.append('visitor', l ?? 0);
      formdata.append('curfew', m ?? 0);
      formdata.append('rating', n ?? 0);
      formdata.append('min_price', o ?? 0);
      formdata.append('max_price', p ?? 0);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data',
        },
        body: formdata,
      });
      const json = await response.json();
      if (json.code === 200) {
        setDorms([]);
        setDorms(json.data);
      } else if (json.code === 403) {
        setDorms([]);
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: json.data,
        });
      }
      setSelectedCategoryIndex(
        categoryList.findIndex(category => category.tag === tag),
      );
    }
  };

  const categoryList = [
    {name: 'Popular', tag: 'popular_dorm'},
    {name: 'Latest', tag: 'latest_dorm'},
    {name: 'Nearest', tag: 'nearest_dorm'},
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
                index === selectedCategoryIndex &&
                  styles.activeCategoryListText,
              ]}>
              {category.name}
            </Text>
          </Pressable>
        ))}
      </View>
    );
  };

  const Card = ({item}) => {
    const images = item.images ? item.images.split(',') : [];
    return (
      <Pressable
        activeOpacity={0.8}
        onPress={() =>
          navigation.navigate('Dorm Details', {dormref: item.id, userref: user, mode: mode})
        }>
        <View style={styles.card}>
          <Image
            source={{uri: `${DORM_UPLOADS}/${item.id}/${images[0]}`}}
            style={styles.cardImage}
          />
          <View style={{marginTop: 10}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 5,
              }}>
              <Text style={{fontSize: 16, fontWeight: 'bold'}}>
                {item.name}
              </Text>
              <Text
                style={{fontWeight: 'bold', color: COLORS.teal, fontSize: 16}}>
                ₱{item.price}
              </Text>
            </View>
            <Text style={{color: COLORS.grey, fontSize: 14, marginTop: 5}}>
              {item.address}
            </Text>
            <View style={{marginTop: 10, flexDirection: 'row'}}>
            <View style={styles.facility}>
                <Icon name="hotel" size={18} />
                <Text style=
                  {styles.facilityText}>
                    Availability: {item.slots} {item.slots > 1 ? 'slots' : 'slot'}
                </Text>
          </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const filter = () => {};

  const handleSearch = text => {
    setSearchQuery(text);
    const filtered = dorms.filter(data =>
      data.name.toLowerCase().includes(text.toLowerCase()) || data.address.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredDorms(filtered);
  };

  const onPressRatings = (rating) => {
    setFilteredRatings(rating);
    console.log(rating)
  }

  const onChanged = (text, s) => {
      if(s == 0 ) {
        setFilteredMinPrice(text.replace(/[^0-9]/g, ''));
      } else {
        setFilteredMaxPrice(text.replace(/[^0-9]/g, ''));
      }
  }

  const clearFilter = () => {
    
  }
  TouchableOpacity
  return (
    
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>


      <Modal
        animationType={'fade'}
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Toast.show({
            type: 'success',
            text1: 'StudyHive',
            text2: 'Modal has been closed.',
          });
          setModal(!modal);
        }}>
        <TouchableOpacity
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            height: '100%',
            backgroundColor: '#0000004a',
          }}
          onPress={() => setModal(!modal)}
        />
        <View style={{marginHorizontal: 50, marginTop: 100, padding: 10}}>
          <View
            style={{
              backgroundColor: '#fff',
              padding: 10,
              borderRadius: 10,
              height: 500,
            }}>
        
        <View style={{ borderBottomColor: '#ddd', borderBottomWidth: 2 }}>
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text
        style={{
          fontWeight: 'bold',
          color: '#000',
        }}>
        Filters
      </Text>
    </View>
    <TouchableOpacity onPress={() => setModal(false)}>
      <Icon name="close" size={24} color="#000" />
    </TouchableOpacity>
  </View>
</View>


            <ScrollView>


            {/* PRICE */}
            <View style={styles.sectionContainer}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: '#000',
                    paddingVertical: 10,
                  }}>
                  Price Range
                </Text>
                <View style={{flexDirection:'row'}}>
                  <TextInput
                    style={{width: 100,paddingVertical: 5,paddingHorizontal: 10, backgroundColor:"#eee",borderRadius: 10,fontSize: 10,marginRight: 10}}
                    placeholder={'Min. Price'}
                    value={filteredMinPrice}
                    onChangeText={(data) => onChanged(data, 0)}
                    keyboardType={'numeric'}
                    numeric
                  />
                  <TextInput
                    style={{width: 100,paddingVertical: 5,paddingHorizontal: 10, backgroundColor:"#eee",borderRadius: 10,fontSize: 10,}}
                    placeholder={'Max. Price'}
                    value={filteredMaxPrice}
                    onChangeText={(data) => onChanged(data, 1)}
                    keyboardType={'numeric'}
                    numeric
                  />
                </View>
              </View>


              {/* RATINGS */}
              <View style={styles.sectionContainer}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: '#000',
                    paddingVertical: 10,
                  }}>
                  Ratings
                </Text>
                <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={() => onPressRatings(1)}>
                  {1 <= filteredRatings ? <Icon name="star" size={20}  color={'#ff9900'}/> : <Icon name="star-border" size={20}  color={'gray'}/> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRatings(2)}>
                  {2 <= filteredRatings ? <Icon name="star" size={20}  color={'#ff9900'}/> : <Icon name="star-border" size={20}  color={'gray'}/> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRatings(3)}>
                  {3 <= filteredRatings ? <Icon name="star" size={20}  color={'#ff9900'}/> : <Icon name="star-border" size={20}  color={'gray'}/> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRatings(4)}>
                  {4 <= filteredRatings ? <Icon name="star" size={20}  color={'#ff9900'}/> : <Icon name="star-border" size={20}  color={'gray'}/> }
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onPressRatings(5)}>
                  {5 <= filteredRatings ? <Icon name="star" size={20}  color={'#ff9900'}/> : <Icon name="star-border" size={20}  color={'gray'}/> }
                </TouchableOpacity>
                </View>
              </View>


              {/* HEI */}
              <View style={styles.sectionContainer}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: '#000',
                    paddingVertical: 10,
                  }}>
                  Higher Education Institution
                </Text>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredPet}
                    onPress={() => setFilteredPet(filteredPet === 1 ? 0 : 1)}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                        Polytechnic University of the{'\n'}
                         Philippines
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredPet}
                    onPress={() => setFilteredPet(filteredPet === 1 ? 0 : 1)}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       University of the Philippines
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredPet}
                    onPress={() => setFilteredPet(filteredPet === 1 ? 0 : 1)}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                        Far Eastern University
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredPet}
                    onPress={() => setFilteredPet(filteredPet === 1 ? 0 : 1)}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                        University of Santo Tomas
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredVisitor === 1 ? true : false}
                    onPress={() =>
                      setFilteredVisitor(filteredVisitor === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                    <>
                      National University
                      </>
                  }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       San Beda University
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       Centro Escolar University
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       Technological University of the {'\n'}Philippines
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       De La Salle University
                      </>
                    }
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text={
                      <>
                       Adamson University
                      </>
                    }
                  />
                </View>
              </View>


            {/* AMENITIES */}
              <View style={styles.sectionContainer}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: '#000',
                    paddingVertical: 10,
                  }}>
                  Amenities
                </Text>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredAircon === 1 ? true : false}
                    onPress={() => {
                      setFilteredAircon(filteredAircon === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Air Conditioning"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredElevator === 1 ? true : false}
                    onPress={() => {
                      setFilteredElevator(filteredElevator === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Elevator"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredKitchen === 1 ? true : false}
                    onPress={() => {
                      setFilteredKitchen(filteredKitchen === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Kitchen"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredBeddings === 1 ? true : false}
                    onPress={() => {
                      setFilteredBeddings(filteredBeddings === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Beddings"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredLaundry === 1 ? true : false}
                    onPress={() => {
                      setFilteredLaundry(filteredLaundry === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Laundry"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredLounge === 1 ? true : false}
                    onPress={() => {
                      setFilteredLounge(filteredLounge === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Lounge"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredSecurity}
                    onPress={() => {
                      setFilteredSecurity(filteredSecurity === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Security"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredParking === 1 ? true : false}
                    onPress={() => {
                      setFilteredParking(filteredParking === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Parking"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredSecurity === 1 ? true : false}
                    onPress={() => {
                      setFilteredSecurity(filteredSecurity === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Security"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredStudyRoom === 1 ? true : false}
                    onPress={() => {
                      setFilteredStudyRoom(filteredStudyRoom === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Study Room"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredWifi === 1 ? true : false}
                    onPress={() => {
                      setFilteredWifi(filteredWifi === 1 ? 0 : 1);
                      filter();
                    }}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Wi-Fi"
                  />
                </View>
              </View>


              {/* AMENITIES */}
              <View style={styles.sectionContainer}>
                <Text
                  style={{
                    textAlign: 'left',
                    fontWeight: 'bold',
                    color: '#000',
                    paddingVertical: 10,
                  }}>
                  Establishment Rules
                </Text>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredPet}
                    onPress={() => setFilteredPet(filteredPet === 1 ? 0 : 1)}
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Pets"
                  />
                </View>
                <View style={styles.checkboxContainer}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredVisitor === 1 ? true : false}
                    onPress={() =>
                      setFilteredVisitor(filteredVisitor === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Visitor"
                  />
                </View>
                <View style={styles.checkboxContainer1}>
                  <BouncyCheckbox
                    size={15}
                    isChecked={filteredCurfew === 1 ? true : false}
                    onPress={() =>
                      setFilteredCurfew(filteredCurfew === 1 ? 0 : 1)
                    }
                    textStyle={{
                      marginLeft: -5,
                      fontSize: 13,
                      textDecorationLine: 'none',
                      marginBottom: -10,
                    }}
                    fillColor={COLORS.teal}
                    unfillColor={COLORS.white}
                    iconStyle={{borderColor: COLORS.teal, marginBottom: -10}}
                    text="Curfew"
                  />
                </View>
              </View>
            </ScrollView>


<View style={styles.clearAllContainer}>
  <TouchableOpacity onPress={() => {
                    setFilteredAircon(0);
                    setFilteredElevator(0);
                    setFilteredBeddings(0);
                    setFilteredKitchen(0);
                    setFilteredLaundry(0);
                    setFilteredLounge(0);
                    setFilteredParking(0);
                    setFilteredSecurity(0);
                    setFilteredStudyRoom(0);
                    setFilteredWifi(0);
                    setFilteredPet(0);
                    setFilteredVisitor(0);
                    setFilteredCurfew(0);
                    setFilteredRatings(0);
                    setFilteredMinPrice(0);
                    setFilteredMaxPrice(0);
                    setModal(false);
                    Toast.show({
                        type: 'success',
                        text1: 'StudyHive',
                        text2: 'Your filter has been cleared.',
                    });
                }}
                >
                  <Text style={styles.clearAllButtonText}>Clear all</Text>
  </TouchableOpacity>
</View>

          </View>
        </View>
      </Modal>

      
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />
      <View style={styles.header}>
        <View>
          <Text style={{color: COLORS.grey}}>Location</Text>
          <Text style={{color: COLORS.teal, fontSize: 20, fontWeight: 'bold'}}>
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
          <TextInput
            placeholder="Search address, city, location"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
        <TouchableOpacity onPress={() => setModal(!modal)}>
          <View style={styles.sortBtn}>
            <Icon name="tune" color={COLORS.white} size={25} />
          </View>
        </TouchableOpacity>
      </View>
      <ListCategories />
      <FlatList
        snapToInterval={width - 20}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
        horizontal={false}
        data={searchQuery ? filteredDorms : dorms}
        ListHeaderComponent={() => <View />}
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
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkboxContainer1: {
    flexDirection: 'row',
    marginBottom: 60,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
  clearAllContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingVertical: 13,
    borderTopColor: '#ddd',
    borderTopWidth: 2,
    borderRadius: 20,
    paddingRight: 10, // Add some right padding to the container
  },
  clearAllButtonText: {
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 13,
    textDecorationLine: 'underline',
    color: 'black',
  },
  sectionContainer: {
    marginLeft: 15,
  },
});

export default HomeScreen;

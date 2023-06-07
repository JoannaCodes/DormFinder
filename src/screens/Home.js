/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
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
} from 'react-native';
// import {initialStyles} from '../styles/initial'
import axios from 'axios';
import {BASE_URL, DORM_UPLOADS} from '../../constants/index';
//
import PushNotificationConfig from '../components/PushNotificationConfig';
import PushNotification, {Importance} from 'react-native-push-notification';
//
import COLORS from '../consts/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
const {width} = Dimensions.get('screen');
import houses from '../consts/houses';
//
import Drawer from '../components/drawer';

const HomeScreen = ({navigation}) => {
  PushNotificationConfig.configure();

  useEffect(() => {
    // _fetchNotif();
		console.log(selectedCategoryIndex);
    if (selectedCategoryIndex === 0) {
      popularDorms();
    } else if (setSelectedCategoryIndex === 1) {
      latestDorms();
    } else if (selectedCategoryIndex === 2) {
      nearestDorms();
    }
  }, [selectedCategoryIndex]);

  const _fetchNotif = () => {
    let URL = BASE_URL;
    axios.get(URL + '?tag=fetch_saved_notif').then(res => {
      console.log(res.data);
      var output = JSON.parse(res.data);
      let testx = '';
      try {
        if (output.length != 0) {
          for (var key in output) {
            let test = output[key].scheduled;
            if (test != '' || test != null) {
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

  const [dorms, setDorms] = useState('');
	const [selectedCategoryIndex, setSelectedCategoryIndex] = React.useState(0);

  const popularDorms = () => {
    axios
      .get(`${BASE_URL}?tag=popular_dorm`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        console.log('Popular', data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const latestDorms = () => {
    axios
      .get(`${BASE_URL}?tag=latest_dorm`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        console.log('Latest', data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const nearestDorms = () => {
    axios
      .get(`${BASE_URL}?tag=nearest_dorm`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        console.log('Nearest', data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const categoryList = ['Popular', 'Latest', 'Nearest'];

  const ListCategories = () => {
    return (
      <View style={style.categoryListContainer}>
        {categoryList.map((category, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedCategoryIndex(index);
            }}>
            <Text
              style={[
                style.categoryListText,
                index === selectedCategoryIndex && style.activeCategoryListText,
              ]}>
              {category}
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
        onPress={() => navigation.navigate('Dorm Details', item)}>
        <View style={style.card}>
          {/* House image */}
          <Image
            source={{uri: `${DORM_UPLOADS}/${item.id}/${images[0]}`}}
            style={style.cardImage}
          />
          <View style={{marginTop: 10}}>
            {/* Title and price container */}
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

            {/* Location text */}
            <Text style={{color: COLORS.grey, fontSize: 14, marginTop: 5}}>
              {item.address}
            </Text>

            {/* Facilities container */}
            <View style={{marginTop: 10, flexDirection: 'row'}}>
              <View style={style.facility}>
                <Icon name="hotel" size={18} />
                <Text style={style.facilityText}>2</Text>
              </View>
              <View style={style.facility}>
                <Icon name="bathtub" size={18} />
                <Text style={style.facilityText}>2</Text>
              </View>
              <View style={style.facility}>
                <Icon name="aspect-ratio" size={18} />
                <Text style={style.facilityText}>100m</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: COLORS.white, flex: 1}}>
      {/* Customise status bar */}
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.white}
        barStyle="dark-content"
      />

      {/* Header container */}
      <View style={style.header}>
        <View>
          <Text style={{color: COLORS.grey}}>Location</Text>
          <Text style={{color: COLORS.teal, fontSize: 20, fontWeight: 'bold'}}>
            Manila, Philippines
          </Text>
        </View>
      </View>

      {/* Input and sort button container */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
        }}>
        <View style={style.searchInputContainer}>
          <Icon name="search" color={COLORS.grey} size={25} />
          <TextInput placeholder="Search address, city, location" />
        </View>

        {/* Make the "tune" icon touchable */}
        <TouchableOpacity onPress={() => console.log('Sort button pressed')}>
          <View style={style.sortBtn}>
            <Icon name="tune" color={COLORS.white} size={25} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Render categories */}
      <ListCategories />

      {/* Render Card */}
      <FlatList
        snapToInterval={width - 20}
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{paddingLeft: 20, paddingVertical: 20}}
        horizontal={false}
        data={dorms}
        ListHeaderComponent={() => <View>{/* Empty view for spacing */}</View>}
        renderItem={Card}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
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
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});
export default HomeScreen;

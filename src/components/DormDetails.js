import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity, 
  ToastAndroid,
  Linking,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, DORM_UPLOADS } from '../../constants/index';
const {width} = Dimensions.get('screen');
import { API_URL, AUTH_KEY } from '../../constants/index';

import ViewReviews from '../components/ViewReviews';

import axios from 'axios';

const DormDetails = ({navigation, route}) => {
  const dormref = route.params.dormref;
  const userref = route.params.userref;

  const [user, setUser] = useState([]);
  const [dorms, setDorms] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isBookmarked, setBookmarked] = useState(false);
  const [rating, setRating] = useState(0);
  const [rate, setRate] = useState(0);
  
  useEffect(async () => {
    const data = await AsyncStorage.getItem('user');
    const convertData = JSON.parse(data);
    setUser(convertData)

    fetchData();
    fetchReviews();
  }, []);

  const fetchData = () => {
    axios 
    .get(`${BASE_URL}?tag=get_dorm_details&dormref=${dormref}`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        const dormImages = data.images.split(',');
        setImages(dormImages)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const fetchReviews = async () => {
    await axios
      .get(`${BASE_URL}?tag=get_reviews&dormref=${dormref}`)
      .then(response => {
        const data = JSON.parse(response.data);
        const ratings = data.map(val => {
          return val.rating;
        });
        const totalRatings = ratings.reduce((a, b) => a + b, 0);
        const averageRating = totalRatings / ratings.length;

        setRate(ratings.length);
        setRating(averageRating);
      });
  };


  const InteriorCard = ({item}) => {
    return <Image
    source={{ uri: `${DORM_UPLOADS}/${dormref}/${item}` }}
    style={style.interiorImage}
  />
  };

  const handleMessageNow = async () => {
    // Handle the "Message Now" button press here
    try {
      const formdata = new FormData();

      formdata.append('action',  'addChat');
      formdata.append('unique_code',  dorms.id);
      formdata.append('myid',  user.id);
      formdata.append('other_id', dorms.userref);

      await axios.post(API_URL, formdata, {
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data'
        },
      }).then(response => {
        const json = response.data;
        if (json.code == 200) {
          Toast.show({
            type: 'success',
            text1: 'UniHive',
            text2: json.data,
          });
        }
      }).catch(error => {
        Toast.show({
          type: 'error',
          text1: 'UniHive',
          text2: 'Error, you already have conversation with this user!',
        });
      });
    } catch(ex) {
      console.log(ex)
    }
    
  };

  const handleReportListing = () => {
    // Handle the "Report Listing" button press here
  };

  const handleFavorite = async () => {
    try {
      const formData = new FormData();
      formData.append('dormref', dormref);
      formData.append('userref', userref);

      let response;
  
      if (!pressed) {
        formData.append('tag', 'add_bookmarks');
        response = await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
          response.data === 1
          ? (Toast.show({
            type: 'success',
            text1: 'StudyHive',
            text2: 'Success',
          })) 
          : (Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'Error',
          }))
      
          console.log(response.data); 
  
        fetchData();
      }
      
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'StudyHive',
        text2: error.message,
      });
    }
  };
  

  const handleRatingPress = () => {
  };

    const handleAddressPress = () => {
      const address = encodeURIComponent(dorms.address);
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${address}`;
      Linking.openURL(mapsUrl);
    };


  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}


        <View style={style.backgroundImageContainer}>
  <ImageBackground style={style.backgroundImage} source={{ uri: `${DORM_UPLOADS}/${dormref}/${images[0]}` }}>
    <View style={style.header}>
      <TouchableOpacity style={style.headerBtn}  onPress={() => {
                                      handleFavorite();
                                      setPressed(!pressed)
                                      }}>
      <Icon name="favorite" size={20}  color={pressed ? COLORS.red : COLORS.grey} />
      </TouchableOpacity>
    </View>
  </ImageBackground>
</View>

        <ViewReviews
              visible={modalVisible}
              onClose={() => setModalVisible(false)}
              dormref={dormref}
            />

        <View style={style.detailsContainer}>
          {/* Name and rating view container */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
              {dorms.name}
            </Text>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={style.ratingTag}
                  onPress={() => {
                     handleRatingPress();
                    setModalVisible(true);
                    // console.log(item.dormref);
                  }}>
                  <Text style={{color: COLORS.white}}>{rating}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                     handleRatingPress();
                    setModalVisible(true);
                    // console.log(item.dormref);
                  }}>
                <Text style={{fontSize: 13, marginLeft: 5}}>{rate} ratings</Text>
                </TouchableOpacity>
              </View>
          </View>

          {/* Location text */}
          <TouchableOpacity onPress={handleAddressPress}>
        <Text style={{fontSize: 15, color: 'gray' , textDecorationLine: 'underline'}}>{dorms.address}</Text>
      </TouchableOpacity>

          <View style={{flexDirection: 'row', marginTop: 5}}>
            <Text style={{fontSize: 16, color: 'black'}}>
              Availability: {dorms.slots} slots
            </Text>
          </View>

          {/* Facilities container */}
          <View style={{marginTop: 8}}>
  <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
    Amenities
  </Text>
  </View>
          <View style={{flexDirection: 'column', marginTop: 4}}>
  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
    <View style={style.facility}>
      <Icon name="ac-unit" size={18} />
      <Text style={style.facilityText}>Air Conditioning</Text>
    </View>
    <View style={style.facility}>
      <Icon name="elevator" size={18} />
      <Text style={style.facilityText}>Elevator</Text>
    </View>
    <View style={style.facility}>
      <Icon name="single-bed" size={18} />
      <Text style={style.facilityText}>Beddings</Text>
    </View>
  </View>
  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
    <View style={style.facility}>
      <Icon name="kitchen" size={18} />
      <Text style={style.facilityText}>Kitchen</Text>
    </View>
    <View style={style.facility}>
      <Icon name="local-laundry-service" size={18} />
      <Text style={style.facilityText}>Laundry</Text>
    </View>
    <View style={style.facility}>
      <Icon name="meeting-room" size={18} />
      <Text style={style.facilityText}>Lounge</Text>
    </View>
  </View>
  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
    <View style={style.facility}>
      <Icon name="local-parking" size={18} />
      <Text style={style.facilityText}>Parking</Text>
    </View>
    <View style={style.facility}>
      <Icon name="security" size={18} />
      <Text style={style.facilityText}>Security</Text>
    </View>
    <View style={style.facility}>
      <Icon name="menu-book" size={18} />
      <Text style={style.facilityText}>Study room</Text>
    </View>
  </View>
  <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'}}>
    <View style={style.facility}>
      <Icon name="wifi" size={18} />
      <Text style={style.facilityText}>Wi-Fi</Text>
    </View>
  </View>
</View>
          <Text style={{color: COLORS.grey}}>
            {dorms.details}
          </Text>
          {/* Interior list */}
          <FlatList
            contentContainerStyle={{marginTop: 1}}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            data={images}
            renderItem={InteriorCard}
          />

<View style={{marginTop: 20}}>
  <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
    Nearby Schools
  </Text>
  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
    {typeof dorms.hei === 'string' && dorms.hei.split(',').map((school, index) => (
      <View key={index} style={[style.heiContainer]}>
        <View style={style.heiText}>
          <Text style={{ fontSize: 15, color: 'white' }}>
            {school.trim()}
          </Text>
        </View>
      </View>
    ))}
  </View>
</View>


      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
          Description 
        </Text>
        <Text style={{fontSize: 15, color: COLORS.black}}>
         {dorms.desc}
        </Text>
      </View>

  <View style={{ marginTop: 15 }}>
    <Text style={{ fontSize: 16, color: 'black', fontWeight: 'bold' }}>
        Establishment Rules
    </Text>
    <View style={{ flexDirection: 'column', marginTop: 5 }}>
    <View style={style.facility1}>
          <Icon name="pets" size={18} />
          {dorms.pets === 0 ? (
            <Text style={style.facilityText}>Pets are not allowed</Text>
          ) : (
            <Text style={style.facilityText}>Pets are allowed</Text>
          )}
        </View>
        <View style={style.facility1}>
          <Icon name="group" size={18} />
          {dorms.visitors === 0 ? (
            <Text style={style.facilityText}>Visitors are not allowed</Text>
          ) : (
            <Text style={style.facilityText}>Visitors are allowed</Text>
          )}
        </View>
        <View style={style.facility1}>
          <Icon name="schedule" size={18} />
          {dorms.curfew === 0 ? (
            <Text style={style.facilityText}>No observance of curfew</Text>
          ) : (
            <Text style={style.facilityText}>Observance of curfew</Text>
          )}
        </View>
      </View>
  </View>

  <View style={{marginTop: 10}}>
    <Text style={{fontSize: 16, color: 'black', fontWeight: 'bold'}}>
        Payment & Duration Terms
    </Text>
    <View style={{ flexDirection: 'column', marginTop: 5 }}>
  {dorms.adv_dep !== 'N/A' && (
    <View style={style.facility1}>
      <Icon name="payments" size={18} />
      <Text style={style.facilityText}>Advance Deposit:</Text>
      <Text style={style.facilityText}>₱ {dorms.adv_dep}.00</Text>
    </View>
  )}
  {dorms.util !== 'N/A' && (
    <View style={style.facility1}>
      <Icon name="bolt" size={18} />
      <Text style={style.facilityText}>Utility Exclusive:</Text>
      <Text style={style.facilityText}>{dorms.util}</Text>
    </View>
  )}
  {dorms.sec_dep !== 'N/A' && (
    <View style={style.facility1}>
      <Icon name="shield" size={18} />
      <Text style={style.facilityText}>Security Deposit:</Text>
      <Text style={style.facilityText}>₱ {dorms.sec_dep}.00</Text>
    </View>
  )}
  {dorms.min_stay !== 'N/A' && (
    <View style={style.facility}>
      <Icon name="event" size={18} />
      <Text style={style.facilityText}>Minimum Stay:</Text>
      <Text style={style.facilityText}>{dorms.min_stay} month/s</Text>
    </View>
  )}
  {dorms.adv_dep === 'N/A' && dorms.util === 'N/A' && dorms.sec_dep === 'N/A' && dorms.min_stay === 'N/A' && (
    <Text style={{ fontStyle: 'italic' , fontSize: 14}}>No Terms for Payment and Duration</Text>
  )}
</View>
  </View>

  
  <View style={{marginTop: 13}}>
      <TouchableOpacity onPress={handleReportListing}>
        <View style={style.facility}>
              <Text style={{fontSize: 13, color: 'black', textDecorationLine: 'underline'}}>Report this listing</Text>
        </View>
      </TouchableOpacity>
  </View>



          {/* footer container */}
          <View style={style.footer}>
            <View>
              <Text
                style={{color: COLORS.teal, fontWeight: 'bold', fontSize: 18}}>
                ₱{dorms.price}
              </Text>
              <Text
                style={{fontSize: 12, color: COLORS.grey, fontWeight: 'bold'}}>
                Total Price
              </Text>
            </View>
            {user.id !== dorms.userref ? 
            <TouchableOpacity
              style={style.bookNowBtn}
              onPress={handleMessageNow}>
              <Text style={{color: COLORS.white}}>Message Now</Text>
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={style.bookNowBtn}
              onPress={() => navigation.navigate('InboxTab')}>
              <Text style={{color: COLORS.white}}>View Chats</Text>
            </TouchableOpacity>
            }
          </View>
        </View>
      </ScrollView>
      
    </SafeAreaView>
  );
};

const style = StyleSheet.create({
  backgroundImageContainer: {
    elevation: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: 'center',
    height: 350,
  },
  backgroundImage: {
    height: '100%',
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  headerBtn: {
    height: 40,
    width: 40,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingTag: {
    height: 30,
    width: 35,
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interiorImage: {
    width: width / 3 - 20,
    height: 80,
    marginRight: 10,
    borderRadius: 10,
  },
  footer: {
    height: 70,
    backgroundColor: COLORS.light,
    borderRadius: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bookNowBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  detailsContainer: {
    flex: 1, 
    paddingHorizontal: 20, 
    marginTop: 15
  },
  facility: {
  flexDirection: 'row', 
  marginRight: 15,
  },
  facility1: {
    flexDirection: 'row', 
    marginRight: 15,
    marginBottom: 7,
  },
  facilityText: {
    marginLeft: 5, 
  },
  heiContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginRight: 7,
  },
  heiText: {
    backgroundColor: '#05998c',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 5,
    fontSize: 15,
    color: 'white',
  },
});

export default DormDetails;

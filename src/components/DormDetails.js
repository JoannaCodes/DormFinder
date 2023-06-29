/* eslint-disable prettier/prettier */
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
  Share,
  Modal,
} from 'react-native';
import { WebView } from 'react-native-webview';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL, DORM_UPLOADS, API_URL, AUTH_KEY  } from '../../constants/index';
const {width} = Dimensions.get('screen');
import ImageViewer from 'react-native-image-zoom-viewer';

import ReportForm from '../components/ReportForm';
// import ReviewForm from '../components/ReviewForm';

import ViewReviews from '../components/ViewReviews';

import axios from 'axios';

const DormDetails = ({navigation, route}) => {
  const dormref = route.params.dormref;
  const userref = route.params.userref;
  const mode = route.params.mode;

  const [user, setUser] = useState([]);

  const [dorms, setDorms] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [rating, setRating] = useState(0);
  const [rate, setRate] = useState(0);
  const [getAmenities, setAmenities] = useState(true)
  
  useEffect(async () => {
    const data = await AsyncStorage.getItem('user');
    const convertData = JSON.parse(data);
    setUser(convertData)

    fetchData();
    fetchRatings();
    fetchAmenities();
  }, []);


  const [selectedDorm, setSelectedDorm] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState('');

const [isPopupVisible, setPopupVisible] = useState(false);
const [selectedImageIndex, setSelectedImageIndex] = useState(0);


//DORMS
const fetchData = async () => {
  /*
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
      });*/
  const formdata = new FormData();
  formdata.append('action',  'get_dorm_details');
  formdata.append('dormref',  dormref);
  formdata.append('user_id',  userref);

  await axios.post(API_URL, formdata, {
    headers: {
      'Auth-Key': AUTH_KEY,
      'Content-Type': 'multipart/form-data'
    },
  }).then(response => {
    const json = response.data;
    if (json.code == 200) {
      setDorms(json.data);
      const dormImages = json.data.images.split(',');
      setImages(dormImages)
    }
  }).catch((ex) => {
    return false;
  });
};

const fetchAmenities = async () => {
  const formdata = new FormData();

  formdata.append('action',  'getAmenities');
  formdata.append('unique_code',  dormref);

  await axios.post(API_URL, formdata, {
    headers: {
      'Auth-Key': AUTH_KEY,
      'Content-Type': 'multipart/form-data'
    },
  }).then(response => {
    const json = response.data;
    if (json.code == 200) {
      setAmenities(json.data);
    }
  }).catch((ex) => {
    return false;
  });
};


//REVIEWS AND TOTAL
const fetchRatings = async () => {
  await axios
    .get(`${BASE_URL}?tag=get_reviews&dormref=${dormref}`, {
      headers: {
        'Auth-Key': AUTH_KEY,
      },
    })
    .then(response => {
      const data = JSON.parse(response.data);
      if (data.length != 0) {
        const ratings = data.map(val => {
          return parseInt(val.rating, 10);
        });

        const totalRatings = ratings.reduce((a, b) => a + b, 0) ?? 0;
        const averageRating = totalRatings / ratings.length ?? 0;

        setRate(ratings.length ?? 0);
        setRating(Math.floor(averageRating) ?? 0);
      }
    });
};


// SMALL IMAGES
const InteriorCard = ({item}) => {
  return <Image
    source={{ uri: `${DORM_UPLOADS}/${dormref}/${item}` }}
    style={style.interiorImage}
  />
  };
  const moveToMessage = async () => {
    const formdata = new FormData();

    formdata.append('action',  'getMessageInfos');
    formdata.append('unique_code',  dorms.dormref);
    formdata.append('myid',  user.id);
    formdata.append('other_id', dorms.userref);

    const response = await axios.post(API_URL, formdata, {
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data'
      },
    });
    
    const json = response.data;
    console.log(json);
    if (json.code == 200) {
      navigation.navigate('Chat Room', { 
        navigation: navigation,
        anotherImageUrl: json.data.other.imageUrl,
        username: json.data.other.username,
        unique_code: dorms.dormref,
        chatroom_code: json.data.chatroom_code,
        myid: user.id,
        myusername: json.data.me.username,
        anotherid: dorms.userref,
        user: user
      })
    }
  }
  const handleMessageNow = async () => {
    // Handle the "Message Now" button press here
    try {
      const formdata = new FormData();
      formdata.append('action',  'addChat');
      formdata.append('unique_code',  dorms.dormref);
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
          moveToMessage();
        }
      }).catch(error => {
        moveToMessage();
        /*
        Toast.show({
          type: 'error',
          text1: 'UniHive',
          text2: 'Error, you already have conversation with this user!',
        });*/
      });
    } catch(ex) {
      console.log(ex)
    }
    
  };



// SHARE
const handleShare = async () => {
  try {
    const dormref = {dormref}; 
    const url = `https://studyhive.com/listing/${dormref}`; 

    const shareOptions = {
      title: 'Check out this listing!', // Title of the shared message
      message: `Check out this listing at: ${url}`, 
    };

    const result = await Share.share(shareOptions);

    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // Shared via activity type
        console.log(`Shared via ${result.activityType}`);
      } else {
        // Shared directly
        console.log('Shared directly');
      }
    } else if (result.action === Share.dismissedAction) {
      // Share sheet dismissed by the user
      console.log('Share dismissed');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

// REPORT
const handleReportListing = () => {
  // Handle the "Report Listing" button press here
};


// BOOKMARKS
const handleFavorite = async () => {
  /*
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
    }*/
    const formdata = new FormData();
    formdata.append('action',  'addRemoveFavorite');
    formdata.append('dormref',  dormref);
    formdata.append('user_id',  userref);

    await axios.post(API_URL, formdata, {
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data'
      },
    }).then(response => {
      const json = response.data;
      Toast.show({
        type: 'success',
        text1: 'StudyHive',
        text2: json.data,
      });
      fetchData();
    }).catch((ex) => {
      return false;
    });
  };
  

// RATINGS
const handleRatingPress = () => {
};


// ADDRESS
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
              <TouchableOpacity style={style.headerBtn}  onPress={() => handleFavorite()}>
              <Icon name="favorite" size={20}  color={dorms.myfavorite == 1 ? COLORS.red : COLORS.grey} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <ViewReviews
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          dormref={dormref}
        />


{/* View Reviews */}
<ViewReviews
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  dormref={dormref}
/>
<View style={style.detailsContainer}>


{/* Name and rating view container */}
<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 7}}>
  <Text style={{fontSize: 20, fontFamily: 'Poppins-SemiBold', color: 'black'}}>
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
        <Text style={{fontSize: 13, marginLeft: 5}}>{rate} reviews</Text>
      </TouchableOpacity>
    </View>
</View>

{/* Location text */}
<TouchableOpacity onPress={handleAddressPress}>
  <Text style={{fontSize: 15, color: 'gray' , textDecorationLine: 'underline', marginTop: 2, fontFamily: 'Poppins-Regular',}}>{dorms.address}</Text>
</TouchableOpacity>


{/* Availability */}
<View style={{flexDirection: 'row', marginTop: 12}}>
  <Text style={{fontSize: 17, color: 'black', fontFamily: 'Poppins-Regular'}}>
  Availability: {dorms.slots} {dorms.slots > 1 ? 'slots' : 'slot'}
  </Text>
</View>


{/* Facilities container */}
<View style={{marginTop: 12}}>
  <Text style={{fontSize: 17, color: 'black', fontFamily: 'Poppins-SemiBold'}}>
    Amenities
  </Text>
</View>
<View style={{flexDirection: 'column', marginTop: 4}}>
  <View style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start'}}>
    {getAmenities.aircon == 1 &&
      <View style={style.facility}>
        <Icon name="ac-unit" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Air Conditioning</Text>
      </View>
    }
    {getAmenities.elevator == 1 &&
      <View style={style.facility}>
        <Icon name="elevator" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Elevator</Text>
      </View>
    }
    {getAmenities.beddings == 1 &&
      <View style={style.facility}>
        <Icon name="single-bed" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Beddings</Text>
      </View>
    }
    {getAmenities.kitchen == 1 &&
      <View style={style.facility}>
        <Icon name="kitchen" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Kitchen</Text>
      </View>
    }
    {getAmenities.laundry == 1 &&
      <View style={style.facility}>
        <Icon name="local-laundry-service" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Laundry</Text>
      </View>
    }
    {getAmenities.lounge == 1 &&
      <View style={style.facility}>
        <Icon name="meeting-room" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Lounge</Text>
      </View>
    }
    {getAmenities.parking == 1 &&
      <View style={style.facility}>
        <Icon name="local-parking" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Parking</Text>
      </View>
    }
    {getAmenities.security == 1 &&
      <View style={style.facility}>
        <Icon name="security" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Security</Text>
      </View>
    }
    {getAmenities.study_room == 1 &&
      <View style={style.facility}>
        <Icon name="menu-book" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Study room</Text>
      </View>
    }
    {getAmenities.wifi == 1 &&
      <View style={style.facility}>
        <Icon name="wifi" size={18} style={{alignSelf:"center"}} />
        <Text style={style.facilityText}>Wi-Fi</Text>
      </View>
    }
  </View>
</View>

{/* Not sure kung ano */}
<Text style={{color: COLORS.grey}}>
  {dorms.details}
</Text>


{/* Interior list */}
<FlatList
  contentContainerStyle={{ marginTop: 1 }}
  horizontal
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item, index) => String(index)}
  data={images}
  renderItem={({ item, index }) => (
    <TouchableOpacity onPress={() => {
      setSelectedImageIndex(index);
      setPopupVisible(true);
    }}>
      <InteriorCard item={item} />
    </TouchableOpacity>
  )}
/>

<Modal visible={isPopupVisible} transparent={true}>
  <ImageViewer
    imageUrls={images.map(image => ({ url: `${DORM_UPLOADS}/${dormref}/${image}` }))}
    index={selectedImageIndex}
    onCancel={() => setPopupVisible(false)}
    renderHeader={() => (
      <TouchableOpacity style={style.closeButton} onPress={() => setPopupVisible(false)}>
       <Icon name="close" size={25} color="black" />
      </TouchableOpacity>
    )}
  />
</Modal>


{/*Nearby Schools*/}
<View style={{marginTop: 22}}>
  <Text style={{fontSize: 17, color: 'black', fontFamily: 'Poppins-SemiBold'}}>
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


{/*Description*/}
  <View style={{marginTop: 22}}>
    <Text style={{fontSize: 17, color: 'black', fontFamily: 'Poppins-SemiBold', marginBottom: 7}}>
      About this dormitory
    </Text>
    <Text style={{fontSize: 15, color: COLORS.black}}>
      {dorms.desc}
    </Text>
  </View>


{/*Establishment Rules*/}
  <View style={{ marginTop: 22 }}>
    <Text style={{ fontSize: 17, color: 'black', fontFamily: 'Poppins-SemiBold' }}>
        Establishment Rules
    </Text>
    <View style={{ flexDirection: 'column', marginTop: 5 }}>
    <View style={style.facility1}>
          <Icon name="pets" size={18} />
          {dorms.pets === 0 ? (
            <Text style={style.facilityText2}>Pets are not allowed</Text>
          ) : (
            <Text style={style.facilityText2}>Pets are allowed</Text>
          )}
        </View>
        <View style={style.facility1}>
          <Icon name="group" size={18} />
          {dorms.visitors === 0 ? (
            <Text style={style.facilityText2}>Visitors are not allowed</Text>
          ) : (
            <Text style={style.facilityText2}>Visitors are allowed</Text>
          )}
        </View>
        <View style={style.facility1}>
          <Icon name="schedule" size={18} />
          {dorms.curfew === 0 ? (
            <Text style={style.facilityText2}>No observance of curfew</Text>
          ) : (
            <Text style={style.facilityText2}>Observance of curfew</Text>
          )}
        </View>
      </View>
  </View>


{/*Payment & Duration Terms*/}
<View style={{marginTop: 12}}>
    <Text style={{fontSize: 17, color: 'black', fontFamily: 'Poppins-SemiBold'}}>
        Payment & Duration Terms
    </Text>
    <View style={{ flexDirection: 'column', marginTop: 5 }}>
  {dorms.adv_dep !== '' && (
    <View style={style.facility1}>
      <Icon name="payments" size={18} />
      <Text style={style.facilityText2}>Advance Deposit:</Text>
      <Text style={style.facilityText2}>₱ {dorms.adv_dep}.00</Text>
    </View>
  )}
  {dorms.util !== '' && (
    <View style={style.facility1}>
      <Icon name="bolt" size={18} />
      <Text style={style.facilityText2}>Utility Exclusive:</Text>
      <Text style={style.facilityText2}>{dorms.util}</Text>
    </View>
  )}
  {dorms.sec_dep !== '' && (
    <View style={style.facility1}>
      <Icon name="shield" size={18} />
      <Text style={style.facilityText2}>Security Deposit:</Text>
      <Text style={style.facilityText2}>₱ {dorms.sec_dep}.00</Text>
    </View>
  )}
  {dorms.min_stay !== '' && (
    <View style={style.facility1}>
      <Icon name="event" size={18} />
      <Text style={style.facilityText2}>Minimum Stay:</Text>
      <Text style={style.facilityText2}>{dorms.min_stay} month/s</Text>
    </View>
  )}
  {dorms.adv_dep === '' && dorms.util === '' && dorms.sec_dep === '' && dorms.min_stay === '' && (
    <Text style={{ fontStyle: 'italic' , fontSize: 14}}>No Terms for Payment and Duration</Text>
  )}
    </View>
  </View>

  <Text style={{ fontSize: 17, fontFamily: 'Poppins-SemiBold', marginTop: 15 , color: 'black'}}> Where you'll be </Text>
  <View
   renderToHardwareTextureAndroid={true} 
   style={{
    marginTop: 10,
    ...(mode === 'guest' && { marginBottom: 16 }),
    height: 300,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    overflow: 'hidden',
  }}>
<WebView
  userAgent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
  source={{html: `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes"><iframe width="100%" height="100%" src="https://maps.google.com/maps?f=q&source=s_q&hl=en&geocode=&q=${dorms.new_address}&aq=0&oq=199+ch&ie=UTF8&hq=&hnear=${dorms.new_address}&t=m&z=17&output=embed" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`}}
  style={{ marginTop: 10, height: 300}}/>
</View>


{/* Report listing*/}
{mode === 'guest' ? null : (
  <View style={{marginTop: 13}}>
    <TouchableOpacity                 
      onPress={() => {
      handleReportListing();
      setReportModalVisible(true);
      setSelectedDorm(dormref);
      }}>
        <View>
          <Text style={{fontSize: 15, color: 'black', textDecorationLine: 'underline'}}>Report this listing</Text>
        </View>
    </TouchableOpacity>
  </View>
)}



{/* footer container */}
{mode === 'guest' ? null : (
  <View style={style.footer}>
    <View>
      <Text
        style={{color: COLORS.teal, fontFamily: 'Poppins-SemiBold', fontSize: 18}}>
        ₱ {dorms.price}
      </Text>
        <Text
          style={{fontSize: 12, color: COLORS.grey, fontFamily: 'Poppins-SemiBold',}}>
          Total Price
        </Text>
    </View>
    {user.id !== dorms.userref ? 
    <TouchableOpacity
      style={style.bookNowBtn}
      onPress={handleMessageNow}>
      <Text style={{color: COLORS.white, fontFamily: 'Poppins-Regular',}}>Message Now</Text>
    </TouchableOpacity>
    :
    <TouchableOpacity
      style={style.bookNowBtn}
      onPress={() => navigation.navigate('InboxTab')}>
      <Text style={{color: COLORS.white}}>View Chats</Text>
    </TouchableOpacity>
    }
  </View>
)}

</View>
</ScrollView>
  <ReportForm
    visible={reportModalVisible}
    onClose={() => setReportModalVisible(false)}
    userref={userref}
    dormref={dormref}
   />
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
    borderRadius: 50,
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
    width:'33.333%',
    textAlign:"center",
    textAlignVertical:"center",
    paddingVertical: 10,
    alignSelf:"center",
    alignContent:"center",
    alignSelf:"center"
  },
  facility1: {
    flexDirection: 'row', 
    marginRight: 15,
    marginBottom: 7,
  },
  facilityText: {
    textAlign:"center",
    marginTop: 10
  },
  facilityText2: {
    textAlign:"center",
    marginLeft: 10
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
  closeButton: {
      position: 'absolute',
      top: 20,
      right: 20,
      padding: 2,
      borderRadius: 20,
      zIndex: 999,
      backgroundColor: 'white',
  },
});

export default DormDetails;
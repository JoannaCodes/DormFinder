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
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';
import { BASE_URL, DORM_UPLOADS } from '../../constants/index';
const {width} = Dimensions.get('screen');

import ViewReviews from '../components/ViewReviews';

import axios from 'axios';

const DormDetails = ({navigation, route}) => {
  const dormref = route.params.dormref;

  const [dorms, setDorms] = useState([]);
  const [images, setImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [isBookmarked, setBookmarked] = useState(false); 
  
  useEffect(() => {
    fetchData();
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

  const InteriorCard = ({item}) => {
    return <Image
    source={{ uri: `${DORM_UPLOADS}/${dormref}/${item}` }}
    style={style.interiorImage}
  />
  };

  const handleMessageNow = () => {
    // Handle the "Message Now" button press here
  };

  const handleFavorite = async () => {
    try {
      const formData = new FormData();
      formData.append('tag', 'add_bookmarks');
      formData.append('dormref', dormref);
      formData.append('userref', 'LhVQ3FMv6d6lW');
  
      let response;
  
      if (pressed) {
        response = await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setBookmarked(!pressed);
  
        const message =
          response.data === 'Dorm added to bookmarks'
            ? 'Dorm added to bookmarks'
            : 'Dorm removed from bookmarks';
  
        Toast.show({
          type: 'success',
          text1: 'Dorm Finder',
          text2: message,
        });
  
        if (!pressed) {
          fetchData();
        }
      } else {
        const formData = new FormData();
        formData.append('tag', 'delete_bookmark');
        formData.append('dormref', dormref);
  
        response = await axios.post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        Toast.show({
          type: 'success',
          text1: 'Dorm Finder',
          text2: response.data,
        });
  
        fetchData();
      }
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Dorm Finder',
        text2: error.message,
      });
    }
  };
  
//   const handleFavorite = () => {
//   try {
//     const formData = new FormData();
//     formData.append('tag', 'add_bookmarks');
//     formData.append('dormref', dormref);
//     formData.append('userref', 'LhVQ3FMv6d6lW');

//     const response = await axios.post(BASE_URL, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     const message = response.data === 'Dorm added to bookmarks' ? 'Dorm added to bookmarks' : 'Dorm removed from bookmarks';

//     setBookmarked(!isBookmarked);

//     Toast.show({
//       type: 'success',
//       text1: 'Dorm Finder',
//       text2: message,
//     });

//     if (!isBookmarked) {
//       fetchData();
//     }
//   } catch (error) {
//     console.error(error);
//     Toast.show({
//       type: 'error',
//       text1: 'Dorm Finder',
//       text2: error.message,
//     });
//   }
// };

// const handleFavoriteIconPress = async () => {
//   try {
//     if (isBookmarked) {
//       await _deleteBookmark(dormref);
//       Toast.show({
//         type: 'success',
//         text1: 'Dorm Finder',
//         text2: 'Dorm removed from bookmarks',
//       });
//     } else {
//       await handleFavorite();
//       Toast.show({
//         type: 'success',
//         text1: 'Dorm Finder',
//         text2: 'Dorm added to bookmarks',
//       });
//     }
//     setBookmarked(!isBookmarked);
//   } catch (error) {
//     console.error(error);
//     Toast.show({
//       type: 'error',
//       text1: 'Dorm Finder',
//       text2: error.message,
//     });
//   }
// };

// const _deleteBookmark = async dormref => {
//   const formData = new FormData();
//   formData.append('tag', 'delete_bookmark');
//   formData.append('userref', 'LhVQ3FMv6d6lW');
//   formData.append('dormref', dormref);

//   try {
//     const response = await axios.post(BASE_URL, formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     Toast.show({
//       type: 'success',
//       text1: 'Dorm Finder',
//       text2: response.data,
//     });

//     fetchData();
//   } catch (error) {
//     console.error(error);
//     Toast.show({
//       type: 'error',
//       text1: 'Dorm Finder',
//       text2: error.message,
//     });
//   }
// };

  const handleRatingPress = () => {
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}


        <View style={style.backgroundImageContainer}>
  <ImageBackground style={style.backgroundImage} source={{ uri: `${DORM_UPLOADS}/${dormref}/${images[0]}` }}>
    <View style={style.header}>
      {/* <TouchableOpacity
        style={style.headerBtn}
        onPress={navigation.goBack}>
        <Icon name="arrow-back-ios" 
          size={20} 
          style={{ marginLeft: 10 }}/>
      </TouchableOpacity> */}
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
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {dorms.name}
            </Text>
            <TouchableOpacity onPress={() => handleRatingPress}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={style.ratingTag}
                  onPress={() => {
                    setModalVisible(true);
                    // console.log(item.dormref);
                  }}>
                  <Text style={{color: COLORS.white}}>4.8</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 13, marginLeft: 5}}>155 ratings</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Location text */}
          <Text style={{fontSize: 16, color: COLORS.grey}}>
            {dorms.address}
          </Text>

          {/* Facilities container */}
          <View style={{flexDirection: 'row', marginTop: 20}}>
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
              <Text style={style.facilityText}>100m area</Text>
            </View>
          </View>
          <Text style={{marginTop: 20, color: COLORS.grey}}>
            {dorms.details}
          </Text>

          {/* Interior list */}
          <FlatList
            contentContainerStyle={{marginTop: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => String(index)}
            data={images}
            renderItem={InteriorCard}
          />

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
            <TouchableOpacity
              style={style.bookNowBtn}
              onPress={handleMessageNow}>
              <Text style={{color: COLORS.white}}>Message Now</Text>
            </TouchableOpacity>
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
  detailsContainer: {flex: 1, paddingHorizontal: 20, marginTop: 40},
  facility: {flexDirection: 'row', marginRight: 15},
  facilityText: {marginLeft: 5, color: COLORS.grey},
});

export default DormDetails;

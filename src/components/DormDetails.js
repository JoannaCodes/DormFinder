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
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../consts/colors';
import { BASE_URL, DORM_UPLOADS } from '../../constants/index';
const {width} = Dimensions.get('screen');


const DormDetails = ({navigation, route}) => {
  const dormref = route.params.dormref;
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
    .get(`${BASE_URL}?tag=dorm_details&dormref=${dormref}`)
      .then(response => {
        const data = response.data;
        setDorms(data);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const InteriorCard = ({interior}) => {
    return <Image source={interior} style={style.interiorImage} />;
  };

  const handleMessageNow = () => {
    // Handle the "Message Now" button press here
  };

  const handleFavorite = () => {
    // Handle the "Favorite" button press here
  };

  const handleRatingPress = () => {
    // Handle the rating press here
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* House image */}

        <View style={style.backgroundImageContainer}>
          <ImageBackground style={style.backgroundImage} source={house.image}>
            <View style={style.header}>
              <TouchableOpacity
                style={style.headerBtn}
                onPress={navigation.goBack}>
                <Icon name="arrow-back-ios" 
                  size={20} 
                  style={{ marginLeft: 10 }}/>
              </TouchableOpacity>
              <TouchableOpacity style={style.headerBtn} onPress={handleFavorite}>
                <Icon name="favorite" size={20} color={COLORS.red} />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>

        <View style={style.detailsContainer}>
          {/* Name and rating view container */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              {house.title}
            </Text>
            <TouchableOpacity onPress={handleRatingPress}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity
                  style={style.ratingTag}
                  onPress={handleRatingPress}>
                  <Text style={{color: COLORS.white}}>4.8</Text>
                </TouchableOpacity>
                <Text style={{fontSize: 13, marginLeft: 5}}>155 ratings</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Location text */}
          <Text style={{fontSize: 16, color: COLORS.grey}}>
            {house.location}
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
            {house.details}
          </Text>

          {/* Interior list */}
          <FlatList
            contentContainerStyle={{marginTop: 20}}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, key) => key.toString()}
            data={house.interiors}
            renderItem={({item}) => <InteriorCard interior={item} />}
          />

          {/* footer container */}
          <View style={style.footer}>
            <View>
              <Text
                style={{color: COLORS.teal, fontWeight: 'bold', fontSize: 18}}>
                ₱1,500
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

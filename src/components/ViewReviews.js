/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, USER_UPLOADS} from '../../constants';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const ViewReviews = ({visible, onClose, dormref}) => {
  let URL = BASE_URL;
  const [reviews, setReviews] = useState('');
  const [rating, setRating] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('Success');

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchReviews();
    }, [dormref]),
  );

  const fetchReviews = async () => {
    await axios
      .get(`${URL}?tag=get_reviews&dormref=${dormref}`)
      .then(response => {
        setReviews(JSON.parse(response.data));
        const output = JSON.parse(response.data);
        const ratings = output.map(val => {
          return val.rating;
        });
        const totalRatings = ratings.reduce((a, b) => a + b, 0);
        const averageRating = totalRatings / ratings.length;
        setRating(averageRating);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'An error occured. Please try again',
        });
        setStatus('Failed');
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDismiss = () => {
    setReviews('');
    onClose();
  };

  const renderItem = ({item}) => {
    return (
      <View style={styles.card}>
        <View>
          <View style={styles.cardHeader}>
            <Image
              source={{
                uri: `${USER_UPLOADS}/${item.id}/${item.imageUrl}`,
              }}
              style={styles.image}
            />
            <Text>{item.username}</Text>
          </View>
          <View style={styles.rating}>
            <View style={styles.stars}>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <Text key={index}>
                    {item.rating >= index + 1 ? (
                      <Icon name="star-rate" size={18} color="gold" />
                    ) : (
                      <Icon name="star-outline" size={18} color="#0E898B" />
                    )}
                  </Text>
                ))}
            </View>
            <Text style={{marginStart: 16}}>{item.createdAt}</Text>
          </View>
        </View>
        <Text>{item.comment}</Text>
      </View>
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
              source={require('../../assets/comments_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Reviews Yet</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Rating and Reviews
            </Text>
            <TouchableOpacity onPress={handleDismiss}>
              <Icon name="close" size={30} color="#FF0000" />
            </TouchableOpacity>
          </View>
          <View style={styles.total}>
            <View
              style={[
                styles.stars,
                {flexGrow: 1, justifyContent: 'space-around'},
              ]}>
              {Array(5)
                .fill(null)
                .map((_, index) => (
                  <Text key={index}>
                    {rating >= index + 1 ? (
                      <Icon name="star-rate" size={30} color="gold" />
                    ) : (
                      <Icon name="star-outline" size={30} color="#0E898B" />
                    )}
                  </Text>
                ))}
            </View>
            <Text>Total rating</Text>
          </View>
          <SafeAreaView style={styles.reviews}>
            {isLoading ? (
              <ActivityIndicator size={'large'} color={'#0E898B'} />
            ) : (
              <FlatList
                contentContainerStyle={{flexGrow: 1, paddingTop: 16}}
                data={reviews}
                keyExtractor={item => item.id}
                ListEmptyComponent={renderEmpty}
                renderItem={renderItem}
              />
            )}
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
};

export default ViewReviews;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    height: '85%',
    borderRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 16,
  },
  total: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    margin: 16,
  },
  reviews: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  image: {
    borderColor: '#CCCCCC',
    borderRadius: 50,
    borderWidth: 1,
    height: 45,
    width: 45,
    marginEnd: 16,
  },
  rating: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

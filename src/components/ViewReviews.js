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
import axios from 'axios';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';

const ViewReviews = ({visible, onClose, dormref}) => {
  let URL = BASE_URL;
  const [reviews, setReviews] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('Success');

  useFocusEffect(
    React.useCallback(() => {
      fetchReviews();
    }, [dormref]),
  );

  const fetchReviews = async () => {
    await axios
      .get(`${URL}?tag=get_reviews&dormref=${dormref}`)
      .then(response => {
        setReviews(JSON.parse(response.data));
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: error,
        });
        setStatus('Failed');
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
                  <Text key={index} style={styles.star}>
                    {item.rating >= index + 1 ? '⭐' : '☆'}
                  </Text>
                ))}
            </View>
            <Text>{item.createdAt}</Text>
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
              <Text>❌</Text>
            </TouchableOpacity>
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
    marginEnd: 16,
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

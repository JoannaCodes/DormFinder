/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, DORM_UPLOADS} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ViewReviews from '../ViewReviews';
import VerifiyPromtpModal from '../modals/VerifiyPromtpModal';
import COLORS from '../../../constants/colors';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const DormListing = ({route, navigation}) => {
  const {user, verified} = route.params;
  let URL = BASE_URL;

  const [isLoading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);

  const [selectedDorm, setSelectedDorm] = useState('');
  const [status, setStatus] = useState('success');
  const [dorms, setDorms] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await axios
      .get(`${URL}?tag=get_dorms&userref=${user}`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);
        setStatus('success');

        // Exclude image URLs from the data
        const dataWithoutImages = data.map(item => {
          const {images, ...rest} = item;
          return rest;
        });

        AsyncStorage.setItem('dormListing', JSON.stringify(dataWithoutImages));
      })
      .catch(async error => {
        const storedDorms = await AsyncStorage.getItem('dormListing');
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

  const _deleteDorm = dormref => {
    Alert.alert(
      'Dorm Finder',
      'Are you sure you want to delete this dorm listing? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'delete',
          onPress: async () => {
            const formData = new FormData();
            formData.append('tag', 'delete_dorm');
            formData.append('userref', user);
            formData.append('dormref', dormref);

            await axios
              .post(BASE_URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(response => {
                const message = response.data;

                if (message === 'success') {
                  Toast.show({
                    type: 'success',
                    text1: 'StudyHive',
                    text2: 'Dorm listing deleted',
                  });

                  setLoading(true);
                  fetchData();
                } else if (message === 'failed') {
                  Toast.show({
                    type: 'success',
                    text1: 'StudyHive',
                    text2: 'Unable to delete listing. Please try again.',
                  });
                  fetchData();
                }
              });
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const images = item.images ? item.images.split(',') : [];
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: `${DORM_UPLOADS}/${item.id}/${images[0]}`,
          }}
          style={styles.image}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Separator />
          <View style={styles.action}>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                status === 'failed' && styles.failedButton,
              ]}
              disabled={status === 'failed'}
              onPress={() =>
                navigation.navigate('Listing Form', {
                  dormref: item.id,
                  userref: user,
                  editmode: true,
                })
              }>
              <Icon name="mode-edit" size={18} color={COLORS.teal} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setReviewModalVisible(true);
                setSelectedDorm(item.id);
              }}>
              <Icon name="insights" size={18} color={COLORS.teal}/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                _deleteDorm(item.id);
              }}>
              <Icon name="delete" size={18} color={COLORS.teal}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'failed' ? (
          <>
            <Image
              source={require('../../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>
              Cannot retrieve dorm listing at this time.
            </Text>
            <Text style={styles.message}>Please try again later.</Text>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                {alignItems: 'center', marginTop: 20, width: '40%'},
              ]}
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
              source={require('../../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>No Dorm Listing</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.message}>Tap "</Text>
              <Icon name="add" size={18} color={COLORS.teal} />
              <Text style={styles.message}>" to Add YourDorm</Text>
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
          <ActivityIndicator size="large" color={COLORS.teal} />
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.cardContainer}
            data={dorms}
            horizontal={false}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmpty}
            numColumns={2}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
            }
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              verified
                ? navigation.navigate('Listing Form', {
                    userref: user,
                    editmode: false,
                  })
                : setPromptModalVisible(true);
            }}>
            <Icon name="add" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </>
      )}
      <ViewReviews
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        dormref={selectedDorm}
      />
      <VerifiyPromtpModal
        visible={promptModalVisible}
        onClose={() => setPromptModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default DormListing;
let width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  cardContainer: {
    flexGrow: 1,
  },
  card: {
    margin: 8,
    width: width / 2 - 24,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  failedButton: {
    opacity: 0.5,
  },
});

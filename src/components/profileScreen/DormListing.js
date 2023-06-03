/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
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
import {useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

import ViewReviews from '../ViewReviews';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const DormListing = ({navigation}) => {
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';
  const [isLoading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDorm, setSelectedDorm] = useState('');
  const [status, setStatus] = useState('Success');
  const [dorms, setDorms] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
  );

  const fetchData = async () => {
    await axios
      .get(`${URL}?tag=get_dorms&userref=${uid}`)
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);

        // Exclude image URLs from the data
        const dataWithoutImages = data.map(item => {
          const {images, ...rest} = item;
          return rest;
        });

        AsyncStorage.setItem('dormListing', JSON.stringify(dataWithoutImages));
      })
      .catch(async error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'Network error. Please check your connection and try again',
        });
        setStatus('Failed');
        const storedDorms = await AsyncStorage.getItem('dormListing');
        if (storedDorms) {
          setDorms(JSON.parse(storedDorms));
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
            formData.append('userref', uid);
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
                    text1: 'Dorm Finder',
                    text2: 'Dorm listing deleted',
                  });

                  setLoading(true);
                  fetchData();
                }
              })
              .catch(error => {
                Toast.show({
                  type: 'error',
                  text1: 'Dorm Finder',
                  text2: 'Cannot delete listing. Please try again',
                });
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
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Separator />
          <View style={styles.action}>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() =>
                navigation.navigate('Dorm Listing Form', {
                  dormref: item.id,
                  userref: uid,
                  editmode: true,
                })
              }>
              <Icon name="mode-edit" size={18} color="#0E898B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setModalVisible(true);
                setSelectedDorm(item.id);
              }}>
              <Icon name="insights" size={18} color="#0E898B" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                _deleteDorm(item.id);
              }}>
              <Icon name="delete" size={18} color="#0E898B" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'Failed' ? (
          <>
            <Image
              source={require('../../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>
              Cannot retrieve dorm listing at this time. Please try again later.
            </Text>
            <TouchableOpacity
              style={styles.btnContainer}
              onPress={() => {
                setLoading(true);
                fetchData();
              }}>
              <Text>Try Again</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require('../../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Dorm Listing</Text>
            <Text>
              Tap "<Icon name="delete" size={18} color="#0E898B" />" to Add Your
              Dorm
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0E898B" />
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
              <RefreshControl
                //refresh control used for the Pull to Refresh
                refreshing={isLoading}
                onRefresh={fetchData}
              />
            }
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Dorm Listing Form', {
                userref: uid,
                editmode: false,
              })
            }>
            <Icon name="add" size={30} color="#FFFFFF" />
          </TouchableOpacity>
        </>
      )}
      <ViewReviews
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        dormref={selectedDorm}
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
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  btnContainer: {
    elevation: 2,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0E898B',
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
    backgroundColor: '#0E898B',
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
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: '#CCCCCC',
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
});

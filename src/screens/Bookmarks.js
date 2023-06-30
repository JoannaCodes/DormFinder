/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, DORM_UPLOADS, API_URL, AUTH_KEY} from '../../constants/index';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useFocusEffect} from '@react-navigation/native';
import COLORS from '../../constants/colors';
import Toast from 'react-native-toast-message';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={COLORS.grey} />;
};

const Bookmarks = ({route, navigation}) => {
  const {user} = route.params;
  let URL = BASE_URL;

  const [isLoading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [status, setStatus] = useState('success');
  const [dorms, setDorms] = useState('');
  const [userInfo, setUserInfo] = useState([]);

  useEffect(async () => {
    const data = await AsyncStorage.getItem('user');
    const convertData = JSON.parse(data);
    setUserInfo(convertData);

    setIsMounted(true);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (isMounted) {
        fetchData();
      }

      return () => {
        // Clean up any resources if needed
      };
    }, [isMounted]),
  );

  const fetchData = async () => {
    await axios
      .get(`${URL}?tag=get_bookmarks&userref=${user}`, {
        headers: {
          'Auth-Key': AUTH_KEY,
        },
      })
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);

        const dataWithoutImages = data.map(item => {
          const {images, ...rest} = item;
          return rest;
        });
        AsyncStorage.setItem('bookmarks', JSON.stringify(dataWithoutImages));
      })
      .catch(async error => {
        const storedDorms = await AsyncStorage.getItem('bookmarks');
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

  const renderItem = ({item}) => {
    const images = item.images ? item.images.split(',') : [];

    const moveToMessage = async () => {
      try {
        const formdata = new FormData();

        formdata.append('action', 'getMessageInfos');
        formdata.append('unique_code', item.id);
        formdata.append('myid', user);
        formdata.append('other_id', item.userref);

        const response = await axios.post(API_URL, formdata, {
          headers: {
            'Auth-Key': AUTH_KEY,
            'Content-Type': 'multipart/form-data',
          },
        });

        const json = response.data;
        if (json.code === 200) {
          navigation.navigate('Chat Room', {
            navigation: navigation,
            anotherImageUrl: json.data.other.imageUrl,
            username: json.data.other.username,
            unique_code: item.id,
            chatroom_code: json.data.chatroom_code,
            myid: user,
            myusername: json.data.me.username,
            anotherid: item.userref,
            user: userInfo,
          });
        }
      } catch (error) {
        console.error('Error occurred during the Axios request:', error);
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: error,
        });
      }
    };

    const handleMessageNow = async () => {
      // Handle the "Message Now" button press here
      try {
        const formdata = new FormData();
        formdata.append('action', 'addChat');
        formdata.append('unique_code', item.id);
        formdata.append('myid', user);
        formdata.append('other_id', item.userref);

        await axios
          .post(API_URL, formdata, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            const json = response.data;
            if (json.code === 200) {
              moveToMessage();
            }
          })
          .catch(error => {
            moveToMessage();
          });
      } catch (error) {
        console.error('Error occurred during the Axios request:', error);
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: 'An error occured',
        });
      }
    };

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        underlayColor={COLORS.grey}
        onPress={() =>
          navigation.navigate('Dorm Details', {
            dormref: item.id,
            userref: user,
          })
        }>
        <View style={styles.card}>
          <Image
            source={{
              uri: `${DORM_UPLOADS}/${item.id}/${images[0]}`,
            }}
            style={styles.cardImage}
          />
          <View style={styles.cardBody}>
            <View style={styles.details}>
              <Text
                style={styles.cardTitle}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.cardText}>₱{item.price}</Text>
            </View>
            <Separator />
            <View style={styles.action}>
              {user !== item.userref ? (
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={handleMessageNow}>
                  <Icon name="message" size={18} color={COLORS.teal} />
                  <Text
                    style={{
                      color: 'black',
                      marginStart: 5,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    Message Now
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.btnContainer}
                  onPress={() => navigation.navigate('InboxTab')}>
                  <Icon name="message" size={18} color={COLORS.teal} />
                  <Text
                    style={{
                      color: 'black',
                      marginStart: 5,
                      fontFamily: 'Poppins-Regular',
                    }}>
                    View Chats
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'failed' ? (
          <>
            <Image
              source={require('../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>
              Cannot retrieve bookmarks at this time.
            </Text>
            <Text style={styles.message}>Please try again.</Text>
            <TouchableOpacity
              style={[styles.btnContainer, {marginTop: 20, width: '100%'}]}
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
              source={require('../../assets/empty_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>Add Bookmarks</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.message}>Tap "</Text>
              <Icon name="favorite" size={18} color={COLORS.red} />
              <Text style={styles.message}>
                " to add the dorm that interests you
              </Text>
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
          <ActivityIndicator size="large" color="#0E898B" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.cardContainer}
          data={dorms}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
          ItemSeparatorComponent={() => {
            return <View style={{flex: 1, height: 16}} />;
          }}
          refreshControl={
            <RefreshControl
              //refresh control used for the Pull to Refresh
              refreshing={isLoading}
              onRefresh={fetchData}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Bookmarks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
    marginTop: -30,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
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
  cardContainer: {
    flexGrow: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 150,
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
  },
  cardBody: {
    flex: 3,
  },
  details: {
    flex: 4,
    justifyContent: 'space-evenly',
    padding: 8,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 10,
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginLeft: 7,
  },
  cardText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
    marginLeft: 7,
  },
});

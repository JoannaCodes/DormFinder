/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Text,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  TextInput,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import {
  API_URL,
  AUTH_KEY,
  CHATROOM_UPLOADS,
  DORM_UPLOADS,
} from '../../constants/index';
import moment from 'moment';
import axios from 'axios';
import {LogBox} from 'react-native';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs([/Warning: /]);
LogBox.ignoreLogs(['Please report: ...']);
LogBox.ignoreLogs([/Please report: /]);

const ChatRoom = props => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const [getDormImage, setDormImage] = useState('');
  const [getDormBool, setDormBool] = useState(true);
  const [getDorm, setDorm] = useState([]);
  const [getLastID, setGetLastID] = useState('');
  const [getLastPreviouslyID, setLastPreviouslyID] = useState(0);
  const [sending, setSending] = useState(false);

  const onSend = useCallback(async (message = []) => {
    try {
      setSending(true);

      if (message[0].text !== '' || message[0].image !== '') {
        let formdata = new FormData();
        formdata.append('action', 'sendChat');
        formdata.append('chatroom_code', props.route.params.chatroom_code);
        formdata.append('myid', props.route.params.myid);
        formdata.append('message', message[0].text ? message[0].text : '');
        formdata.append('image', message[0].image ? message[0].image : '');

        await axios
          .post(API_URL, formdata, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(response => {
            setText('');
          });
      }
      return false;
    } catch (ex) {
      console.error(ex);
    }
  }, []);

  const sendMe = () => {
    if (text.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'StudyHive',
        text2: 'Please enter a value in the textbox!',
      });
      return false;
    }
    const message = [
      {
        _id: new Date().getTime(),
        text: text,
        createdAt: new Date(),
        user: {
          _id: props.route.params.myid,
        },
        image: '',
      },
    ];

    onSend(message);
  };
  const handleCameraButton = () => {
    const options = {
      title: 'Take a photo',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled taking a photo');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      }

      const message = [
        {
          _id: new Date().getTime(),
          text: '',
          createdAt: new Date(),
          user: {
            _id: props.route.params.myid,
          },
          image: 'data:image/png;base64,' + response.assets[0].base64,
        },
      ];

      onSend(message);
    });
  };

  const handleAttachmentButton = () => {
    const options = {
      title: 'Select Attachment',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled taking a photo');
        return;
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        return;
      }
      const message = [
        {
          _id: new Date().getTime(),
          text: '',
          createdAt: new Date(),
          user: {
            _id: props.route.params.myid,
          },
          image: 'data:image/png;base64,' + response.assets[0].base64,
        },
      ];

      onSend(message);
    });
  };

  const previouslyChats = async () => {
    const formdata = new FormData();

    formdata.append('action', 'getPreviouslyChats');
    formdata.append('chatroom_code', props.route.params.chatroom_code);
    formdata.append('myid', props.route.params.myid);
    formdata.append('itr', getLastPreviouslyID === 0 ? 0 : getLastPreviouslyID);

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
          if (json.length !== 0) {
            setLastPreviouslyID(json[json.length - 1].itr);
            setMessages(prev => [...prev, ...json]);
            setSending(false);
          }
        }
      })
      .catch(ex => {
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: 'No results found.',
        });
      });
  };

  const fetchDorm = async () => {
    const formdata = new FormData();

    formdata.append('action', 'getDorm');
    formdata.append('unique_code', props.route.params.unique_code);

    await axios
      .post(API_URL, formdata, {
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const json = response.data.data;
        setDorm(json);
      })
      .catch(ex => {
        return false;
      });
  };

  useEffect(() => {
    let isMounted = true;

    const intervalId = setInterval(async () => {
      const formdata = new FormData();

      formdata.append('action', 'getChats');
      formdata.append('chatroom_code', props.route.params.chatroom_code);
      formdata.append('myid', props.route.params.myid);
      formdata.append('itr', getLastID === 0 ? 0 : getLastID);

      await axios
        .post(API_URL, formdata, {
          headers: {
            'Auth-Key': AUTH_KEY,
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          if (!isMounted) {
            return;
          }
          const json = response.data.data;
          if (json === 'No results found.') {
            return false;
          } else {
            if (json.length !== 0) {
              for (var i = 0; i < json.length; i++) {
                if (i === 0) {
                  setGetLastID(json[i].itr);
                } else {
                  setLastPreviouslyID(json[i].itr);
                }
              }
              setMessages(prev => [...json, ...prev]);
              setSending(false);
            }
          }
        })
        .catch(ex => {
          return false;
        });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, [useState, getLastID, getLastPreviouslyID]);

  // Get dorm
  useEffect(() => {
    if (getDormBool === true) {
      fetchDorm();
      setDormBool(false);
    }
  }, []);

  const renderChat = ({item}) => {
    return [
      item.balloon === false ? (
        <View style={styles.chatOther}>
          <Text style={styles.chatOtherUsername}>{item.username}</Text>
          <ImageBackground
            style={styles.chatAvatar}
            source={{uri: item.imageUrl}}
            resizeMode="cover"
          />
          <View style={styles.chatBalloon}>
            {item.message === '' ? (
              <ImageBackground
                style={{height: 200}}
                source={{uri: `${CHATROOM_UPLOADS}${item.image}`}}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.chatOtherMessage}>{item.message}</Text>
            )}
            <Text style={styles.chatOtherTime}>
              {moment
                .unix(item.time)
                .utcOffset('+0800')
                .format('MM/DD/YYYY hh:mm A')}
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.chatMe}>
          <Text style={styles.chatMeUsername}>{item.username}</Text>
          <View style={styles.chatBalloon}>
            {item.message === '' ? (
              <ImageBackground
                style={{height: 200}}
                source={{uri: CHATROOM_UPLOADS + item.image}}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.chatMeMessage}>{item.message}</Text>
            )}
            <Text style={styles.chatMeTime}>
              {moment
                .unix(item.time)
                .utcOffset('+0800')
                .format('MM/DD/YYYY hh:mm A')}
            </Text>
          </View>
          <ImageBackground
            style={styles.chatAvatar}
            source={{uri: item.imageUrl}}
            resizeMode="cover"
          />
        </View>
      ),
    ];
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{flexDirection: 'row', marginEnd: 20}}
            onPress={() => props.route.params.navigation.navigate('InboxTab')}>
            <Icon name="arrow-back" size={25} color={COLORS.dark} />
          </TouchableOpacity>
          <Image
            style={[styles.chatAvatar, {marginHorizontal: 5}]}
            source={{uri: props.route.params.anotherImageUrl}}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>{props.route.params.username}</Text>
        </View>
        <View style={styles.dormDetails}>
          <View style={styles.dormDetailsContent}>
            <Image
              style={styles.dormDetailsImage}
              source={{
                uri: `${DORM_UPLOADS}/${props.route.params.unique_code}/${getDorm?.first_image}`,
              }}
              resizeMode="contain"
            />
            <View style={{flex: 0.7}}>
              <Text
                style={{fontFamily: 'Poppins-SemiBold', fontSize: 18, color: COLORS.dark}}>
                {getDorm?.name}
              </Text>
              <Text style={{fontSize: 12, fontFamily: 'Poppins-Regular'}}>{getDorm?.address}</Text>
              <Text style={{fontFamily: 'Poppins-SemiBold'}}>₱{getDorm?.price}</Text>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TouchableOpacity
              style={[styles.dormDetailsButton, {flex: 1, marginRight: 5}]}
              onPress={() => {
                props.route.params.navigation.navigate('Dorm Details', {
                  dormref: props.route.params.unique_code,
                  userref: props.route.params.myid,
                });
              }}>
              <Text
                style={{color: 'white', fontFamily: 'Poppins-SemiBold', textAlign: 'center', marginTop: 3}}>
                View Dorm Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dormDetailsButton, {flex: 1, marginLeft: 5}]}
              onPress={() => {
                props.route.params.navigation.navigate('Payments', {
                  payor: props.route.params.myid,
                  merchantid: getDorm?.userref,
                  merchant: props.route.params.username,
                  dorm: getDorm?.name,
                  price: getDorm?.price,
                });
              }}>
              <Text
                style={{color: 'white', fontFamily: 'Poppins-SemiBold', textAlign: 'center', marginTop: 3}}>
                Pay Rent
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {messages.length !== 0 ? (
          <>
            <FlatList
              data={messages}
              extraData={messages}
              keyExtractor={item => item.id}
              renderItem={renderChat}
              ListFooterComponent={() => (
                <TouchableOpacity
                  onPress={() => previouslyChats()}
                  style={{backgroundColor: '#ddd', paddingVertical: 5}}>
                  <Text style={{fontSize: 10, textAlign: 'center', fontFamily: 'Poppins-Regular', marginTop: 2}}>
                    See More
                  </Text>
                </TouchableOpacity>
              )}
              inverted
            />
          </>
        ) : null}
      </View>
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.actionBarButton}
          onPress={handleCameraButton}>
          <Icon name="camera-alt" size={25} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBarButton}
          onPress={handleAttachmentButton}>
          <Icon name="attachment" size={25} color="gray" />
        </TouchableOpacity>
        <TextInput
          style={styles.actionBarInput}
          placeholder="Aa"
          onChangeText={value => setText(value)}
          value={text}
        />
        {sending ? (
          <View style={styles.actionBarButton2}>
            <ActivityIndicator size={30} color={COLORS.teal} />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.actionBarButton2}
            onPress={() => sendMe(text)}>
            <Icon name="send" size={30} color={COLORS.teal} />
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default ChatRoom;

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    height: 56,
    paddingHorizontal: 16,
    elevation: 4,
  },
  headerText: {
    flexDirection: 'row',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    marginTop: 3,
    textAlign: 'left',
    textAlignVertical: 'center',
    paddingLeft: 10,
    color: COLORS.dark,
  },
  actionBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBarButton: {
    flex: 0.1,
    margin: 5,
    alignContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  actionBarButton2: {flex: 0.1, margin: 5},
  actionBarInput: {
    flex: 0.7,
    borderWidth: 1,
    borderColor: COLORS.grey,
    margin: 5,
    fontSize: 16,
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  chatOther: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 20,
  },
  chatOtherUsername: {
    fontSize: 11,
    position: 'absolute',
    left: 45,
    top: -11,
    fontFamily: 'Poppins-SemiBold',
  },
  chatOtherTime: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    textAlign: 'left',
    color: '#fff',
  },
  chatOtherMessage: {
    color: 'white', 
    fontSize: 16, textAlign: 
    'left'},

  chatMe: {
    position: 'relative',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginTop: 20,
  },
  chatMeUsername: {
    fontSize: 11,
    position: 'absolute',
    right: 45,
    top: -11,
    fontFamily: 'Poppins-SemiBold'
  },
  chatMeMessage: {
    color: 'white', 
    fontSize: 16, 
    textAlign: 'right', 
    padding: 2,
    fontFamily: 'Poppins-Regular'
  },
  chatMeTime: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    textAlign: 'right',
    color: 'white',
    marginBottom: -4,
  },

  chatAvatar: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.grey,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: COLORS.grey,
    overflow: 'hidden',
  },
  chatBalloon: {
    backgroundColor: COLORS.teal,
    margin: 5,
    padding: 5,
    borderRadius: 5,
    maxWidth: width * 0.5,
  },
  chatLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dormDetails: {
    backgroundColor: 'white',
    paddingTop: 15,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  dormDetailsContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
  },
  dormDetailsImage: {width: 80, height: 80, flex: 0.2, borderRadius: 10},
  dormDetailsButton: {
    backgroundColor: '#0d898b',
    margin: 15,
    borderRadius: 5,
    paddingVertical: 5,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, ImageBackground, Text, FlatList, View, StyleSheet, Alert, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { API_URL, AUTH_KEY, CHATROOM_UPLOADS, DORM_UPLOADS } from '../../constants/index';
import moment from 'moment';
import axios from 'axios';
import {LogBox} from 'react-native';
import Toast from 'react-native-toast-message';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreLogs([/Warning: /]);
LogBox.ignoreLogs(['Please report: ...']);
LogBox.ignoreLogs([/Please report: /]);

const ChatRoom = (props) => {
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);

  const [getDormImage, setDormImage] = useState("")
  const [getDormBool, setDormBool] = useState(true)
  const [getDorm, setDorm] = useState([]);
  const [getLastID, setGetLastID] = useState(0);
  const [getLastPreviouslyID, setLastPreviouslyID] = useState(0);

  

  const onSend = useCallback(async (message = []) => {
    try {
      if(message[0]['text'] != '' || message[0]['image'] != '') {
        let formdata = new FormData();
        formdata.append('action',  'sendChat');
        formdata.append('unique_code',  props.route.params.unique_code);
        formdata.append('myid',  props.route.params.myid);
        formdata.append('message',  message[0]['text'] ? message[0]['text'] : '');
        formdata.append('image',  message[0]['image'] ? message[0]['image'] : '');
        
        await axios.post(API_URL, formdata, {
          headers: {
            'Auth-Key': AUTH_KEY,
            'Content-Type': 'multipart/form-data'
          },
        }).then(response => {
          const code = response.data.code;
          if(code === 200) {
            Toast.show({
              type: 'success',
              text1: 'UniHive',
              text2: response.data.data,
            });
            
          }/* else {
            
            Toast.show({
              type: 'error',
              text1: 'UniHive',
              text2: 'Error! There\'s something wrong.',
            });
          }*/
          setText('')
        });
      }
      return false;
    } catch(ex) {
      console.error(ex)
    }
    
  }, []);

  const sendMe = () => {
    if(text.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'UniHive',
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
        image: "",
      },
    ];

    onSend(message);
  }
  const handleCameraButton = () => {
    const options = {
      title: 'Take a photo',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
      includeBase64: true,
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        alert('User cancelled taking a photo');
        return;
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
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
          image: "data:image/png;base64," + response['assets'][0].base64,
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

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        alert('User cancelled taking a photo');
        return;
      } else if (response.error) {
        alert('ImagePicker Error: ', response.error);
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
          image: "data:image/png;base64," + response['assets'][0].base64,
        },
      ];

      onSend(message);
      
    });
  };

  const previouslyChats = async () => {
    const formdata = new FormData();

    formdata.append('action',  'getPreviouslyChats');
    formdata.append('unique_code',  props.route.params.unique_code);
    formdata.append('myid',  props.route.params.myid);
    formdata.append('itr', getLastPreviouslyID == 0 ? 0 : getLastPreviouslyID);

    await axios.post(API_URL, formdata, {
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data'
      },
    }).then(response => {
      const json = response.data;
      if (json.code == 200) {
        if(json.length != 0) {
          Toast.show({
            type: 'success',
            text1: 'UniHive',
            text2: 'Successfully fetched!',
          });
          setLastPreviouslyID(json[json.length-1].itr)
          setMessages((prev) => [...prev, ...json]);
        }
      }
    }).catch((ex) => {
      Toast.show({
        type: 'error',
        text1: 'UniHive',
        text2: 'No results found.',
      });
    });
  }

  const fetchDorm = async () => {
    const formdata = new FormData();

    formdata.append('action',  'getDorm');
    formdata.append('unique_code',  props.route.params.unique_code);

    await axios.post(API_URL, formdata, {
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data'
      },
    }).then(response => {
      const json = response.data.data;
      setDorm(json)
    }).catch((ex) => {
      return false;
    })
  }
  
  useEffect(() => {
    let isMounted = true
    
    const intervalId = setInterval(async () => {
      const formdata = new FormData();

      formdata.append('action',  'getChats');
      formdata.append('unique_code',  props.route.params.unique_code);
      formdata.append('myid',  props.route.params.myid);
      formdata.append('itr', getLastID == 0 ? 0 : getLastID);

      await axios.post(API_URL, formdata, {
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data'
        },
      }).then(response => {
        if(!isMounted) return
        const json = response.data.data;

        if (json == "No results found.") {
          return false;
        } else {
          if(json.length != 0) {
            for(var i = 0; i < json.length; i++) {
              if(i == 0) {
                setGetLastID(json[i].itr)
              } else {
                setLastPreviouslyID(json[i].itr)
              }
            }
            setMessages((prev) => [...json, ...prev]);
          }
        }
      }).catch((ex) => {
        return false;
      });
    }, 5000);

    return () => {
      clearInterval(intervalId);
      isMounted = false
    }
  }, [useState, getLastID, getLastPreviouslyID])
  
  // Get dorm
  useEffect(() => {
    if(getDormBool === true) {
      fetchDorm()
      setDormBool(false);
    }
  })

  const renderChat = ({ item }) => {
      return (
        [item.balloon == false ?
          <View style={styles.chatOther}>
            <Text style={styles.chatOtherUsername}>{item.username}</Text>
            <ImageBackground 
              style={styles.chatAvatar}
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
            ></ImageBackground>
            <View style={styles.chatBalloon}>
              {item.message == '' ?
                <ImageBackground 
                  style={{height:200}}
                  source={{ uri: CHATROOM_UPLOADS + item.image }}
                  resizeMode="contain"
                />
                :
                <Text style={styles.chatOtherMessage}>{item.message}</Text>
              }
              <Text style={styles.chatOtherTime}>
                {moment.unix(item.time).utcOffset('+0800').format("MM/DD/YYYY hh:mm:ssA")}
              </Text>
            </View>
          </View>
          : 
        
          <View style={styles.chatMe}>
            <Text style={styles.chatMeUsername}>{item.username}</Text>
            <View style={styles.chatBalloon}>
              
              {item.message == '' ?
                <ImageBackground 
                  style={{height:200}}
                  source={{ uri: CHATROOM_UPLOADS + item.image }}
                  resizeMode="contain"
                />
                :
                <Text style={styles.chatMeMessage}>{item.message}</Text>
              }
              <Text style={styles.chatMeTime}>
                {moment.unix(item.time).utcOffset('+0800').format("MM/DD/YYYY hh:mm:ssA")}
              </Text>
            </View>
            <ImageBackground 
              style={styles.chatAvatar}
              source={{ uri: item.imageUrl }}
              resizeMode="cover"
            ></ImageBackground>
          </View>
          ]
          
        )
  }
  
  return (
    <>
      <View style={styles.container}>
        <View 
          style={styles.header}
        >
          <TouchableOpacity
            style={{flexDirection:'row',}}
            onPress={()=> props.route.params.navigation.navigate('InboxTab')}
          >
            <MaterialCommunityIcons
              name="keyboard-backspace"
              size={25}
              color="gray"
            />
          </TouchableOpacity>
          <Image 
            style={{width: 30, height: 30,marginHorizontal: 10,}}
            source={{ uri: props.route.params.anotherImageUrl }}
            resizeMode="contain"
          />
          <Text style={styles.headerText}>{props.route.params.username}</Text>
        </View>
        <View style={styles.dormDetails}>
          <View style={styles.dormDetailsContent}>
            <Image 
              style={styles.dormDetailsImage}
              source={{ uri: `${DORM_UPLOADS}/${props.route.params.unique_code}/${getDorm?.first_image}` }}
              resizeMode="contain"
            />
            <View style={{flex:0.7}}>
              <Text style={{fontWeight:'bold',fontSize: 18,}}>{getDorm?.name}</Text>
              <Text style={{fontSize: 12}}>{getDorm?.address}</Text>
              <Text style={{fontWeight:'bold'}}>{getDorm?.price}</Text>
            </View>
            
          </View>
          <TouchableOpacity style={styles.dormDetailsButton}
          onPress={() => {
            props.route.params.navigation.navigate('Dorm Details', {
              dormref: props.route.params.unique_code,
              userref: props.route.params.user,
            })
          }}>
              <Text style={{color:"white",fontWeight:"bold",textAlign:"center"}}>View Dorm Details</Text>
          </TouchableOpacity>
        </View>
        {messages.length != 0 ?
          <>
            <FlatList
              data={messages}
              extraData={messages}
              keyExtractor={item => item.id}
              renderItem={renderChat}
              ListFooterComponent={() => (
                <TouchableOpacity 
                  onPress={() => previouslyChats()} 
                  style={{backgroundColor:"#ddd",paddingVertical: 10}}
                >
                    <Text style={{fontSize: 10,textAlign:"center"}}>See More</Text>
                </TouchableOpacity>
              )}
              inverted
            />
          </>
          :
          <View style={styles.chatLoading}>
            <ActivityIndicator size={'small'} color={'#0072ff'} />
          </View>
        }
      </View>
      <View
        style={styles.actionBar}
      >
        <TouchableOpacity 
          style={styles.actionBarButton}
          onPress={handleCameraButton}
        >
          <MaterialCommunityIcons
            name="camera"
            size={25}
            color="gray"
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBarButton}
          onPress={handleAttachmentButton}
        >
        <MaterialCommunityIcons
          name="attachment"
          size={25}
          color="gray"
        />
        </TouchableOpacity>
        <TextInput 
          style={styles.actionBarInput}
          placeholder="Aa"
          onChangeText={(text) => setText(text)}
          value={text} 
        />
        <TouchableOpacity 
          style={styles.actionBarButton2}
          onPress={() => sendMe(text)}
        >
          <MaterialCommunityIcons
            name="send-circle"
            size={35}
            color="#0072ff"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default ChatRoom;

const {width, height}  = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    flexWrap: 'wrap',
    backgroundColor:"#fff",
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  headerText: {flexDirection:'row',fontWeight:'bold',fontSize: 15,textAlign:"left",textAlignVertical:"center",paddingLeft: 10},
  actionBar: {width: "100%", height: 60, backgroundColor: "#fff", flexDirection: 'row', alignItems: 'center', justifyContent: 'center'},
  actionBarButton: {flex: 0.1, margin: 5, alignContent:"center", alignItems:"center", textAlign:"center"},
  actionBarButton2: {flex: 0.1, margin: 5},
  actionBarInput: {flex: 0.7, borderWidth: 1, borderColor: "#888", margin: 5, fontSize: 13, height: 35, paddingHorizontal: 10, borderRadius: 5},
  chatOther: {flexDirection: "row", alignSelf:"flex-start", marginLeft: 10, marginTop: 20,},
  chatOtherUsername: {fontSize: 10, position:'absolute', left: 45, top: -11, fontSize: 11, fontWeight:'bold'},
  chatOtherTime: {fontSize: 9,fontWeight:'400',textAlign:'left',color:'#fff'},
  chatOtherMessage: {color: "white", fontSize: 11, textAlign: "left"},

  chatMe: {position: 'relative', flexDirection: "row", alignSelf:"flex-end", marginRight: 10, marginTop: 20,},
  chatMeUsername: {fontSize: 10, position:'absolute', right: 45, top: -11, fontSize: 11, fontWeight:'bold'},
  chatMeMessage: {color: "white", fontSize: 11, textAlign: "right"},
  chatMeTime: {fontSize: 9,fontWeight:'400',textAlign:'right',color:'#fff'},

  chatAvatar: {marginTop: -7, width: 40, height: 40, backgroundColor:"#fff",borderRadius: 100},
  chatBalloon: {backgroundColor:"#0072ff", margin: 5, padding:5, borderRadius: 5, maxWidth: width * 0.5},
  chatLoading: {position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'},
  dormDetails: {backgroundColor:"#e1e1e1",paddingTop:15,shadowColor: "#000", shadowOffset: { width: 0, height: 7, }, shadowOpacity: 0.43, shadowRadius: 9.51, elevation: 15,},
  dormDetailsContent: {flexDirection:'row',justifyContent:'space-evenly',flexWrap:'wrap',},
  dormDetailsImage: {width:80,height: 80,flex:0.2,borderRadius:10},
  dormDetailsButton: {backgroundColor:'#0d898b', margin: 15, borderRadius: 20, paddingVertical: 10},

});

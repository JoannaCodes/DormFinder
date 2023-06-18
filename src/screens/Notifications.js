/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Modal,
  KeyboardAvoidingView,
  View,
  Text,
  AsyncStorage,
  SafeAreaView,
  StyleSheet,
  Button,
  Image,
  Alert,
  ToastAndroid,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
// import {initialStyles} from '../styles/initial'
import axios from 'axios';
import {BASE_URL} from '../../constants';

export default function Notifications({route, navigation}) {
  const {user} = route.params;
  const [notifContainer, setNotifContainer] = useState('');
  const [longContainer, setLongContainer] = useState('');
  const [downloadedID, setDownloadedID] = useState('');

  const [todayState, setTodayState] = useState('none');
  const [recentState, setRecentState] = useState('none');
  const [longState, setLongState] = useState('none');

  const [showMoreLabel, setShowMoreLabel] = useState('Show More');
  const [showMoreState, setShowMoreState] = useState(false);
  const [colorLabel, setColorLabel] = useState('#7B9A35');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let URL = BASE_URL;

        axios
          .get(URL + '?tag=getnotificationspast' + '&userref=' + user)
          .then(res => {
            console.log(res.data);
            var output = JSON.parse(res.data);
            setNotifContainer(output);
          });
      } catch (error) {
        Alert.alert(error);
      }
    };

    fetchData();
  }, []);

  const renderTodayNotif = itm => {
    return (
      <View
        style={{
          padding: 10,
          marginTop: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#bdc3c7',
        }}>
        <View
          style={{
            borderBottomColor: '#bdc3c7',
            backgroundColor: 'transparent',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <View
            style={{
              width: '70%',
              backgroundColor: 'transparent',
              alignItems: 'flex-start',
            }}>
            <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
              {itm.formatted_date}
            </Text>
          </View>
          <View
            style={{
              width: '30%',
              backgroundColor: 'transparent',
              alignSelf: 'center',
              alignItems: 'flex-end',
            }}>
            <Text style={{fontSize: 16, color: 'black'}}>{itm.title}</Text>
          </View>
        </View>
        <Text style={{fontSize: 16, color: 'black'}}>{itm.ndesc}</Text>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 10,
        paddingLeft: 20,
        paddingTop: 20,
        paddingRight: 20,
        backgroundColor: '#f1f2f6',
      }}>
      <View style={{marginBottom: 20}}>
        <Text style={{fontSize: 16, color: 'gray'}}>STARTING TODAY</Text>
        <View
          style={{
            width: 'auto',
            padding: 10,
            borderRadius: 5,
            backgroundColor: 'white',
            flexDirection: 'column',
          }}>
          <FlatList
            data={notifContainer}
            renderItem={({item}) => renderTodayNotif(item)}
            numColumns={1}
            initialNumToRender={100}
            keyExtractor={(item, index) => String(index)}
          />
        </View>
      </View>
    </View>
  );
}

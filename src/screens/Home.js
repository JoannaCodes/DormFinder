/* eslint-disable react-native/no-inline-styles */
import React,{useState,useEffect} from 'react'
import {Modal,KeyboardAvoidingView,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView} from 'react-native'
import {initialStyles} from '../styles/initial'
import axios from 'axios'
import {BASE_URL} from '../../constants'

import PushNotificationConfig from '../components/PushNotificationConfig';
import PushNotification, {Importance} from 'react-native-push-notification';

PushNotification.createChannel(
{
  channelId: "channel-id", // (required)
  channelName: "My channel", // (required)
  channelDescription: "A channel to categorise your notifications", // (optional) default: undefined.
  playSound: false, // (optional) default: true
  soundName: "default", // (optional) See `soundName` parameter of `localNotification` function
  importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
  vibrate: true, // (optional) default: true. Creates the default vibration pattern if true.
},
(created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

export default function Home({navigation}) { 
	PushNotificationConfig.configure();
	
	useEffect(()=>{
		_fetchNotif();
	},[])
	const _fetchNotif = (data1) => {
		let URL = BASE_URL
		axios.get(URL + "?tag=fetch_saved_notif").then(res=>{
			console.log(res.data);
			var output = JSON.parse(res.data);
			let testx="";
			try {
				if(output.length != 0) {
					for (var key in output) {
						let test=output[key].scheduled;
						if(test != "" || test != null) {
							var javascript_date = new Date(Date.parse(test));
							var unix=javascript_date.getTime() / 1000;
							PushNotification.localNotificationSchedule({
								id: output[key]['unix_time'],
								title: "DormFinder",
								message: output[key]['ndesc'],
								channelId: 'channel-id',
								date: new Date(unix * 1000),
								allowWhileIdle: true,
							})
						}
					}
				}
			} catch (error) {
				console.log("error:" + error);
			}
		})
	}


    return (
	    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
	      <Text>Home</Text>
	      <Button
	        title="Go to Dorm Details"
	        onPress={() => navigation.navigate('Dorm Details')}
	      />
	    </View>
    )
}

/* eslint-disable react-native/no-inline-styles */
	import React,{useState,useEffect} from 'react'
	import {Modal,KeyboardAvoidingView,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView} from 'react-native'
	// import {initialStyles} from '../styles/initial'
	import axios from 'axios'
	import {BASE_URL} from '../../constants'



export default function Notifications({navigation}) {
	const [notifContainer,setNotifContainer] = useState('');
	const [longContainer,setLongContainer] = useState('');
	const [downloadedID,setDownloadedID] = useState('');

	const [todayState,setTodayState] = useState('none');
	const [recentState,setRecentState] = useState('none');
	const [longState,setLongState] = useState('none');

	const [showMoreLabel,setShowMoreLabel] = useState("Show More");
	const [showMoreState,setShowMoreState] = useState(false);
	const [colorLabel,setColorLabel] = useState("#7B9A35");

	useEffect(()=>{
		setDownloadedID("");
		let URL = BASE_URL
	    axios.get(URL + "?tag=getnotificationspast" + "&userref=1122").then(res=>{
    		console.log(res.data);
			var output = JSON.parse(res.data);
			if(output.length == 0 || output.length === "0") {
				setShowMoreLabel("No new notifications.");
				setColorLabel("black");
				setShowMoreState(true);
			}
			var downID="";
			for (var i = 0; i < output.length; i++) {
				downID+=output[i]['id'] + ",";
			}
			setDownloadedID(downID);
			console.log(downloadedID);
			setNotifContainer(output);
		})
	},[])




	const renderTodayNotif=(itm)=>{
		var sentence = itm['scheduled'];
		var pieces = sentence.split(";");
		if(pieces[0].includes("today")) {
			setTodayState('flex');
			return(
				<View style={{padding: 10, marginTop: 0, borderBottomWidth: 1, borderBottomColor: '#bdc3c7'}}>
					<View style={{borderBottomColor: '#bdc3c7', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
						<View style={{width: '50%', backgroundColor: 'transparent',  alignItems: 'flex-start'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{pieces[1]}</Text>
						</View>
						<View style={{width: '50%', backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'flex-end'}}>
							<Text style={{fontSize: 16, color:'black'}}>{pieces[0]}</Text>
						</View>
					</View>
					<Text style={{fontSize: 16, color:'black'}}>{itm['ndesc']}</Text>
				</View>
			)
		}
	}

	const renderLongTimeContainer=(itm)=>{
		var sentence = itm['scheduled'];
		var pieces = sentence.split(";");
		if(pieces[0].includes("month") || pieces[0].includes("year") || pieces[0].includes("months")) {
			setLongState('flex');
			return(
				<View style={{padding: 10, marginTop: 0, borderBottomWidth: 1, borderBottomColor: '#bdc3c7'}}>
					<View style={{borderBottomColor: '#bdc3c7', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
						<View style={{width: '50%', backgroundColor: 'transparent',  alignItems: 'flex-start'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{pieces[1]}</Text>
						</View>
						<View style={{width: '50%', backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'flex-end'}}>
							<Text style={{fontSize: 16, color:'black'}}>{pieces[0]}</Text>
						</View>
					</View>
					<Text style={{fontSize: 16, color:'black'}}>{itm['ndesc']}</Text>
				</View>
			)
		} else {
			setLongState('none');
		}
	}

	const renderRecentNotif=(itm)=>{
		var sentence = itm['scheduled'];
		var pieces = sentence.split(";");
		if(pieces[0].includes("yesterday") || pieces[0].includes("days")) {
			setRecentState('flex');
			return(
				<View style={{padding: 10, marginTop: 0, borderBottomWidth: 1, borderBottomColor: '#bdc3c7'}}>
					<View style={{borderBottomColor: '#bdc3c7', backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row' }}>
						<View style={{width: '50%', backgroundColor: 'transparent',  alignItems: 'flex-start'}}>
							<Text style={{fontSize: 20, fontWeight: 'bold', color:'black'}}>{pieces[1]}</Text>
						</View>
						<View style={{width: '50%', backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'flex-end'}}>
							<Text style={{fontSize: 16, color:'black'}}>{pieces[0]}</Text>
						</View>
					</View>
					<Text style={{fontSize: 16, color:'black'}}>{itm['ndesc']}</Text>
				</View>
			)
		}
	}

	const _ShowMore=()=>{
		let URL = BASE_URL
		axios.get(URL + "?tag=getmorenotification" + "&userref=" + "1122" + "&idstoftech=" + downloadedID).then(res=>{
			var output = JSON.parse(res.data);
			if(output.length === 0 || output.length === "0") {
				setShowMoreLabel("End of notifications.")
				setColorLabel("black");
				setShowMoreState(true);
			} else {
				var downID="";
				for (var i = 0; i < output.length; i++) {
					downID+=output[i]['id'] + ",";
				}
				var append = notifContainer.concat(output);
				for (var i = 0; i < append.length; i++) {
					console.log(append[i]['scheduled']);
				}
				setDownloadedID(downloadedID+downID);
				setNotifContainer(append);
				setLongContainer(append);
			}
		})
	}

	const clearAll=()=>{
		axios.get(BASE_URL + "?tag=clearallnotif" + "&userref=" + "1122").then(res=>{
			Alert.alert('DormFinder', 'All the notifications are cleared.');
		})
	}
  return (
		<View style={{flex: 10, paddingLeft: 20, paddingTop: 20, paddingRight: 20, backgroundColor: '#f1f2f6'}}>
			<Button title="Clear All" onPress={clearAll} />
			<View style={{marginBottom: 20, display: todayState}}>
				<Text style={{fontSize: 16,  color:'gray'}}>TODAY</Text>
				<View style={{width: 'auto', padding: 10, borderRadius: 5, backgroundColor: 'white', flexDirection: 'column'}}>
					<FlatList
						data={notifContainer}
						renderItem = {({item})=>renderTodayNotif(item)} 
						numColumns={1}
						initialNumToRender={100}
						keyExtractor={(item, index) => String(index)}
					/>
				</View>
			</View>
			<View style={{marginBottom: 20}}>
				<View style={{display: recentState}}>
					<Text style={{fontSize: 16,  color:'gray'}}>RECENT</Text>
					<View style={{marginBottom: 20, width: 'auto', padding: 10, borderRadius: 5, backgroundColor: 'white', flexDirection: 'column'}}>
						<FlatList
							data={notifContainer}
							renderItem = {({item})=>renderRecentNotif(item)} 
							numColumns={1}
							initialNumToRender={100}
							keyExtractor={(item, index) => String(index)}
						/>
					</View>
				</View>
				<View style={{display: longState, marginBottom: 20}}>
					<Text style={{fontSize: 16,  color:'gray'}}>A LONG TIME AGO</Text>
					<View style={{marginBottom: 20, width: 'auto', padding: 10, borderRadius: 5, backgroundColor: 'white', flexDirection: 'column'}}>
						<FlatList
							data={longContainer}
							renderItem = {({item})=>renderLongTimeContainer(item)} 
							numColumns={1}
							initialNumToRender={100}
							keyExtractor={(item, index) => String(index)}
						/>
					</View>
				</View>
				<View>
					<View style={{width: 'auto', borderRadius: 5, marginTop: 20,  backgroundColor: 'white', flexDirection: 'column',}}>
						<TouchableOpacity disabled={showMoreState} style={{padding: 10}} onPress={_ShowMore}>
							<Text style={{ fontSize: 20, color: colorLabel }}>{showMoreLabel}</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	)
};

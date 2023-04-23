import {createStackNavigator} from 'react-navigation-stack'
import {createAppContainer} from 'react-navigation'
import {BackHandler,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView,Modal} from 'react-native'
import React,{useState,useEffect} from 'react'
import { withOrientation } from 'react-navigation'
import { withNavigationFocus } from 'react-navigation';
import { HeaderBackButton } from 'react-navigation-stack';
import {DevSettings} from 'react-native';
import Welcome from '../screens/welcome'
import Register from '../screens/register'

console.ignoredYellowBox = true;

const screens = {
	Welcome:{
		screen:Welcome,
		navigationOptions:{
			headerShown:false,
		}
	}
	TournamentRegistration:{
		screen:TournamentRegistration,
		navigationOptions:{
			headerTitle: 'Tournament Registration',
			headerBackVisible:false,
		}
	}
}
const InitialStack = createStackNavigator(screens,{
	defaultNavigationOptions:{

	}
})


export default createAppContainer(InitialStack)


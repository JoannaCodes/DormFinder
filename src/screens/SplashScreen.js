import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, StackActions} from '@react-navigation/native';

//
import Logo from '../../assets/img/bg-transferent.png';

export default function SplashScreen() {
  //
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(async () => {
      const isUserLogin = await AsyncStorage.getItem('isUserLogin');

      if (isUserLogin) {
        navigation.dispatch(StackActions.replace('Main'));
      } else {
        navigation.dispatch(StackActions.replace('Authentication'));
      }
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View></View>

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />

        <Text style={styles.text}>Name of App</Text>
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.bottomText}>Name of developers</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    height: 200,
    width: 200,
  },
  text: {
    color: 'black',
  },
  bottomContainer: {},
  bottomText: {
    color: 'black',
  },
});
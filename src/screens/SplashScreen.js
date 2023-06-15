import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React from 'react';

//
import Logo from '../../assets/img/logo.png';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View />

      <View style={styles.logoContainer}>
        <Image source={Logo} style={styles.logo} />
      </View>

      <View style={styles.bottomContainer}>
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
    height: 350,
    width: 350,
  },
  text: {
    color: 'black',
  },
  bottomContainer: {},
  bottomText: {
    color: 'black',
  },
});

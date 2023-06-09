import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import React from 'react';

//
import Logo from '../../assets/img/bg-transferent.png';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <View />

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

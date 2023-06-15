/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const GuestModeModal = ({onLogout}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/warning_upsketch.png')}
        style={{height: 360, width: 360}}
        resizeMode="cover"
      />
      <Text style={styles.title}>Guest Mode</Text>
      <Text style={styles.message}>
        You are currently in guest mode. Create an account to access UniHive's
        features
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Continue Exploring</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => onLogout()}>
        <Text style={styles.buttonText}>Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginHorizontal: 20,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    borderColor: '#0E898B',
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'teal',
  },
});

export default GuestModeModal;

/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../../constants';
import {Toast} from 'react-native-toast-message';
import axios from 'axios';
import React, {useState, useEffect} from 'react';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

export default function Profile({navigation}) {
  const [user, setUser] = useState('');
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        axios.get(`${URL}?tag=get_account&userref=${uid}`).then(response => {
          var output = JSON.parse(response.data);
          setUser(output);
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'Network error. Please check your connection and try again',
        });
      }
    };

    fetchAccount();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View style={[styles.section, {alignItems: 'center'}]}>
          <View style={styles.imageContainer}>
            <Image source={{uri: user.imageUrl}} style={styles.image} />
            <TouchableOpacity style={styles.editbtn}>
              <Text>✏️</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user.username}</Text>
          <Text style={styles.verificationStatus}>
            {user.is_verified === 1 ? 'Verified' : null}
          </Text>
        </View>

        <Separator />

        <View style={styles.section}>
          <Text style={styles.label}>Account Settings</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Edit Profile')}>
            <Text>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Change Password')}>
            <Text>Change Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dorm Listing Settings</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Dorm Listing')}>
            <Text>Dorm Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Verification')}>
            <Text>Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Payments')}>
            <Text>Payments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutbtn}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  section: {
    marginVertical: 16,
    width: '100%',
    paddingHorizontal: 8,
  },
  imageContainer: {
    width: 100,
    height: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  editbtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0E898B',
    padding: 5,
    borderRadius: 20,
    elevation: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  verificationStatus: {
    color: '#0E898B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#FFFFFF',
    padding: 22,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 4,
  },
  logoutbtn: {
    backgroundColor: '#0E898B',
    alignItems: 'center',
    padding: 11,
    borderRadius: 5,
    elevation: 4,
  },
});

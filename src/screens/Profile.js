/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React from 'react';
import UserProfile from '../components/UserProfile';
import COLORS from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL, AUTH_KEY} from '../../constants';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

export default function Profile({user, verified, onLogout}) {
  const navigation = useNavigation();
  const handleLogOut = async () => {
    try {
      Alert.alert('Log out', 'Are you sure you want to log out?', [
        {
          text: 'Yes',
          onPress: async () => {
            onLogout();
            const data = await AsyncStorage.getItem('user');
            const convertData = JSON.parse(data);
            let formdata = new FormData();
            formdata.append('action', 'setOnlineOffline');
            formdata.append('status', 'offline');
            formdata.append('id', convertData.id);

            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Auth-Key': AUTH_KEY,
              },
              body: formdata,
            });
          },
        },
        {
          text: 'No',
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <UserProfile uid={user} />
        </View>

        <Separator />

        <View style={styles.section}>
          <Text style={styles.label}>Account Settings</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Edit Profile')}>
            <Icon name="person" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Change Password')}>
            <Icon name="vpn-key" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Change Password
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>
            Student Accommodation Listing Settings
          </Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Student Accommodation')}>
            <Icon name="add-business" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Student Accommodation Listing
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Verification')}>
            <Icon name="verified-user" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Verification
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Payment Transactions')}>
            <Icon name="payments" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Transaction History
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Others</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Help')}>
            <Icon name="help" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Help
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Terms and Privacy Policy')}>
            <Icon name="privacy-tip" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 10, fontFamily: 'Poppins-Regular'}}>
              Terms and Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold'}}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
    justifyContent: 'flex-start',
    padding: 5,
  },
  section: {
    marginVertical: 10,
    paddingHorizontal: 8,
  },
  profilebtn: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 5,
    elevation: 4,
    marginVertical: 8,
    padding: 22,
  },
  label: {
    marginTop: 2,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 10,
  },
  failedButton: {
    opacity: 0.5,
  },
});

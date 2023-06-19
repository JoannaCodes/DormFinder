/* eslint-disable react-native/no-inline-styles */
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
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
          onPress: () => {
            onLogout();
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

  const handleEmailPress = () => {
    Linking.openURL('mailto:info.studyhive@gmail.com');
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
            <Text style={{marginStart: 5}}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Change Password')}>
            <Icon name="vpn-key" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 5}}>Change Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dorm Listing Settings</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Dorm Listing')}>
            <Icon name="add-business" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 5}}>Dorm Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Verification')}>
            <Icon name="verified-user" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 5}}>Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Payments')}>
            <Icon name="payments" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 5}}>Payments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Others</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Help')}>
            <Icon name="help" size={20} color={COLORS.darkgrey} />
            <Text style={{marginStart: 5}}>Help</Text>
          </TouchableOpacity>
          <View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={[styles.label, {textAlign: 'center'}]}>
                Contact us at
              </Text>
              <TouchableOpacity onPress={handleEmailPress}>
                <Text
                  style={[
                    styles.label,
                    {
                      marginStart: 5,
                      textAlign: 'center',
                      color: COLORS.blue,
                      textDecorationLine: 'underline',
                    },
                  ]}>
                  info.studyhive@gmail.com
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Logout section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.button} onPress={handleLogOut}>
            <Text style={{color: COLORS.white}}>Logout</Text>
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
    padding: 8,
  },
  section: {
    marginVertical: 16,
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
    fontWeight: 'bold',
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 11,
  },
  failedButton: {
    opacity: 0.5,
  },
});

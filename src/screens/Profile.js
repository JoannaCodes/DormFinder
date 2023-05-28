import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import UserProfile from '../components/UserProfile';
import React from 'react';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

export default function Profile({navigation}) {
  return (
    <KeyboardAvoidingView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <UserProfile />
        </View>

        <Separator />

        <View style={styles.section}>
          <Text style={styles.label}>Account Settings</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Edit Profile')}>
            <Text>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Change Password')}>
            <Text>Change Password</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Dorm Listing Settings</Text>
          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Dorm Listing')}>
            <Text>Dorm Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Verification')}>
            <Text>Verification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profilebtn}
            onPress={() => navigation.navigate('Payments')}>
            <Text>Payments</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.button}>
            <Text style={{color: '#FFFFFF'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    justifyContent: 'flex-start',
    padding: 8,
  },
  section: {
    marginVertical: 16,
    paddingHorizontal: 8,
  },
  profilebtn: {
    backgroundColor: '#FFFFFF',
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
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 11,
  },
});

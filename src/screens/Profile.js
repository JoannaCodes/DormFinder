/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import React from 'react';
import {PrimaryBtn, TertiaryBtn} from '../components/others/Buttons';

const Separator = () => <View style={styles.separator} />;

const Profile = ({route, navigation}) => {
  const uid = route.params.userId;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.header}>{uid}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.label}>Contact Number</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Profile Settings</Text>
          <PrimaryBtn
            title="Edit Profile"
            onPress={() => navigation.navigate('Edit Profile', {userId: uid})}
            buttonColor="#FFFFFF"
            buttonStyle={{marginBottom: 10}}
          />
          <PrimaryBtn
            title="Change Password"
            onPress={() =>
              navigation.navigate('Change Password', {userId: uid})
            }
            buttonColor="#FFFFFF"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Listing Settings</Text>
          <PrimaryBtn
            title="Dorm Listing"
            onPress={() => navigation.navigate('Dorm Listing', {userId: uid})}
            buttonColor="#FFFFFF"
            buttonStyle={{marginBottom: 10}}
          />
          <PrimaryBtn
            title="Verification"
            onPress={() => navigation.navigate('Verification', {userId: uid})}
            buttonColor="#FFFFFF"
            buttonStyle={{marginBottom: 10}}
          />
          <PrimaryBtn
            title="Payments"
            onPress={() => navigation.navigate('Payments', {userId: uid})}
            buttonColor="#FFFFFF"
          />
        </View>

        <View style={styles.section}>
          <Separator />
          <TertiaryBtn title="About Dorm Finder" textColor="#000000" />
          <Separator />
          <TertiaryBtn title="Contact Us" textColor="#000000" />
          <Separator />
        </View>

        <View style={styles.section}>
          <PrimaryBtn
            title="Logout"
            buttonStyle={{height: 45}}
            textStyle={{textAlign: 'center'}}
            textColor="#FFFFFF"
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  section: {
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
  },
  separator: {
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

/* eslint-disable react-native/no-inline-styles */
<<<<<<< HEAD
import React,{useState,useEffect} from 'react'
import {Modal,KeyboardAvoidingView,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView} from 'react-native'
import {initialStyles} from '../styles/initial'
import axios from 'axios'
import {BASE_URL} from '../../constants'
import DocumentPicker from 'react-native-document-picker';
=======
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import React from 'react';
import {PrimaryBtn, TertiaryBtn} from '../components/others/Buttons';

const Separator = () => <View style={styles.separator} />;
>>>>>>> 94c74105714618eb06f88c02cb22b21d25a023e2

export default function Profile({navigation}) {
  async function _sendDocument() {
       try {
    const result = await DocumentPicker.pick({
      type: [
        DocumentPicker.types.pdf,
        DocumentPicker.types.docx,
      ],
    });

    if (!result) {
      console.log('No document selected');
      return;
    }

        const formData = new FormData();
    formData.append('tag', 'upload_image');
    formData.append('document', {
      uri: result[0]['uri'],
      type: result[0]['type'],
      name: result[0]['name'],
    });

    const response = await axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload success:', response.data);

    Alert.alert('Upload success', 'The document file was successfully uploaded to the server.');

    // Do something with the selected file
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled document picker');
    } else {
      console.log('Document picker error:', err);
    }
  }
  }
  return (
<<<<<<< HEAD
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      
      <Button
        title="Go to Edit Profile"
        onPress={() => navigation.navigate('Edit Profile')}
      />
      <Button
        title="Go to Change Password"
        onPress={() => navigation.navigate('Change Password')}
      />
      <Button
        title="Go to Verification"
        onPress={() => navigation.navigate('Verification')}
      />
      <Button
        title="Go to Payments"
        onPress={() => navigation.navigate('Payments')}
      />
      <Button
        title="Send Document"
        onPress={_sendDocument}
      />
=======
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
>>>>>>> 94c74105714618eb06f88c02cb22b21d25a023e2
    </View>
  );

<<<<<<< HEAD
};
=======
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
>>>>>>> 94c74105714618eb06f88c02cb22b21d25a023e2

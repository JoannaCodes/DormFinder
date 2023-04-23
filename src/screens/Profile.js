/* eslint-disable react-native/no-inline-styles */
import React,{useState,useEffect} from 'react'
import {Modal,KeyboardAvoidingView,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView} from 'react-native'
import {initialStyles} from '../styles/initial'
import axios from 'axios'
import {BASE_URL} from '../../constants'
import DocumentPicker from 'react-native-document-picker';

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
    </View>
  );

};

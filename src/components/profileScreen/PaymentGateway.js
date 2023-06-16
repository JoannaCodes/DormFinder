import React from 'react';
import {Platform, Linking, Modal,KeyboardAvoidingView,View,Text,AsyncStorage,SafeAreaView,StyleSheet,Button,Image,Alert, ToastAndroid, TouchableOpacity,TextInput,FlatList,ScrollView} from 'react-native'
import { goToAppSettings, openInStore } from 'react-native-app-link';

export default function PaymentGateway({navigation}) {
const openGCashApp = () => {
  openInStore({ appName: 'GCash', playStoreId: 'com.globe.gcash.android',  })
    .catch(() => {
      Alert.alert(
        'GCash Not Found',
        'The GCash app is not installed on your device. Would you like to install it?',
        [
          { text: 'No', style: 'cancel' },
          { text: 'Yes', onPress: () => goToAppSettings() }
        ]
      );
    });
};

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>PaymentGateway</Text>
      <Button title="Open GCash App" onPress={openGCashApp} />
    </View>
  );
};

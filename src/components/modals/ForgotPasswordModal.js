/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, AUTH_KEY} from '../../../constants';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const ForgotPasswordModal = ({visible, onClose}) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function _postReport() {
    setLoading(true);
    const formData = new FormData();
    formData.append('tag', 'forgot_password');
    formData.append('email', email);

    await axios
      .post(BASE_URL, formData, {
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const message = response.data;

        if (message === 'success') {
          Toast.show({
            type: 'success',
            text1: 'StudyHive',
            text2: 'Email sent. Please check you email inbox.',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'Unable to send email. Please try again.',
          });
        }
      })
      .catch(error => {
        console.error('Error occurred during the Axios request:', error);
      })
      .finally(() => {
        setLoading(false);
        setEmail('');
        onClose();
      });
  }

  const handleDismiss = () => {
    setEmail('');
    onClose();
  };

  return (
    <KeyboardAvoidingView>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Forgot Password</Text>
              <TouchableOpacity
                onPress={handleDismiss}
                style={styles.closeButton}>
                <Icon name="close" size={27} color="#FF0000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={value => setEmail(value)}
              placeholder="Enter registered email address"
              placeholderTextColor="#CCCCCC"
              height={40}
              textAlignVertical="top"
              keyboardType={'email-address'}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={_postReport}
              disabled={email.length === 0}
              style={[
                styles.button,
                {backgroundColor: email.length === 0 ? '#CCCCCC' : '#0E898B'},
              ]}>
              {loading ? (
                <ActivityIndicator size={'small'} color={'#FFFFFF'} />
              ) : (
                <Text style={{color: '#FFFFFF', fontFamily: 'Poppins-Regular', marginTop: 3}}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    width: '90%',
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 23,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: -10,
    color: 'black',
  },
  input: {
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    fontFamily: 'Poppins-Regular',
  },
  characterCount: {
    alignSelf: 'flex-end',
    marginTop: 4,
    color: '#BBBBBB',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 8,
    marginTop: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 3,
    right: 1,
  },
});

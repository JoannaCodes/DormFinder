/* eslint-disable react-native/no-inline-styles */
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const VerifiyPromtpModal = ({visible, onClose}) => {
  const handleDismiss = () => {
    onClose();
  };

  return (
    <View>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Verification
              </Text>
              <TouchableOpacity onPress={handleDismiss}>
                <Icon name="close" size={30} color="#FF0000" />
              </TouchableOpacity>
            </View>
            <Image
              source={require('../../../assets/upload_document_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>
              Please submit the required documents for verification to proceed
              with adding a dorm listing.
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default VerifiyPromtpModal;

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
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderColor: '#0E898B',
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: 'teal',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

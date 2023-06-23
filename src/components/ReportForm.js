import React, { useState } from 'react';
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
import { BASE_URL } from '../../constants';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';

const MAX_CHARACTERS = 300;

const ReportForm = ({ visible, onClose, userref, dormref }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  async function _postReport() {
    setLoading(true);
    const formData = new FormData();
    formData.append('tag', 'post_report');
    formData.append('dormref', dormref);
    formData.append('userref', userref);
    formData.append('comment', comment);

    await axios
      .post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        const message = response.data;

        if (message === 'success') {
          Toast.show({
            type: 'success',
            text1: 'StudyHive',
            text2: 'Report submitted',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'Unable to submit report. Please try again.',
          });
        }
      })
      .catch(error => {
        console.log(error);
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: 'An error occured. Please try again.',
        });
      })
      .finally(() => {
        setLoading(false);
        setComment('');
        onClose();
      });
  }

  const handleDismiss = () => {
    setComment('');
    onClose();
  };

  return (
    <KeyboardAvoidingView>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.headerText}>
                Why are you reporting{'\n'}this listing?
              </Text>
              <TouchableOpacity onPress={handleDismiss} style={styles.closeButton}>
                <Icon name="close" size={30} color="#FF0000" />
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={(value) => setComment(value)}
              placeholder="Let us know what's happening so we can resolve this quickly"
              placeholderTextColor="#CCCCCC"
              height={150}
              textAlignVertical="top"
              multiline
              maxLength={MAX_CHARACTERS}
            />
            <Text style={styles.characterCount}>{comment.length}/{MAX_CHARACTERS}</Text>
            <TouchableOpacity
              onPress={_postReport}
              disabled={comment.length === 0}
              style={[
                styles.button,
                { backgroundColor: comment.length === 0 ? '#CCCCCC' : '#0E898B' },
              ]}
            >
              {loading ? (
                <ActivityIndicator size={'small'} color={'#FFFFFF'} />
              ) : (
                <Text style={{ color: '#FFFFFF' }}>Report</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

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
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black',
  },
  input: {
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 4,
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
    padding: 11,
    marginTop: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
});

export default ReportForm;

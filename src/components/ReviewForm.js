/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {BASE_URL} from '../../constants';
import axios from 'axios';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const ReviewForm = ({visible, onClose, userref, dormref}) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const starRatingOptions = [1, 2, 3, 4, 5];
  const [starRating, setStarRating] = useState(1);
  const animatedButtonScale = new Animated.Value(1);

  async function _postReview() {
    setLoading(true);
    const formData = new FormData();
    formData.append('tag', 'post_review');
    formData.append('dormref', dormref);
    formData.append('userref', userref);
    formData.append('rating', starRating);
    formData.append('comment', comment);

    await axios
      .post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        Toast.show({
          type: 'success',
          text1: 'Dorm Finder',
          text2: response.data,
        });
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'An error occured. Please Try Again',
        });
      })
      .finally(() => {
        setLoading(false);
        setComment('');
        setStarRating(1);
        onClose();
      });
  }

  const handlePressIn = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1.5,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  };

  const animatedScaleStyle = {
    transform: [{scale: animatedButtonScale}],
  };

  const handleDismiss = () => {
    setStarRating(0);
    setComment('');
    onClose();
  };

  return (
    <KeyboardAvoidingView>
      <Modal transparent={true} animationType="fade" visible={visible}>
        <View style={styles.container}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                Dorm Review
              </Text>
              <TouchableOpacity onPress={handleDismiss}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.stars}>
              {starRatingOptions.map(option => (
                <TouchableWithoutFeedback
                  onPressIn={() => handlePressIn(option)}
                  onPressOut={() => handlePressOut(option)}
                  onPress={() => setStarRating(option)}
                  key={option}>
                  <Animated.View style={animatedScaleStyle}>
                    <Text
                      style={
                        starRating >= option
                          ? styles.starSelected
                          : styles.starUnselected
                      }>
                      {starRating >= option ? '⭐' : '☆'}
                    </Text>
                  </Animated.View>
                </TouchableWithoutFeedback>
              ))}
            </View>
            <TextInput
              style={styles.input}
              value={comment}
              onChangeText={value => setComment(value)}
              placeholder="Say something..."
              placeholderTextColor="#CCCCCC"
              height={150}
              textAlignVertical="top"
              multiline
            />
            <TouchableOpacity
              onPress={() => {
                _postReview();
              }}
              disabled={comment.length === 0}
              style={[
                styles.button,
                {backgroundColor: comment.length === 0 ? '#CCCCCC' : '#0E898B'},
              ]}>
              {loading ? (
                <ActivityIndicator size={'small'} color={'#FFFFFF'} />
              ) : (
                <Text style={{color: '#FFFFFF'}}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default ReviewForm;

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
  stars: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  starUnselected: {
    color: '#aaa',
  },
  starSelected: {
    color: '#ffb300',
  },
  comments: {
    marginTop: 10,
  },
  input: {
    height: 40,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 4,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 11,
    marginTop: 16,
  },
});

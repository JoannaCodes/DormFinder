/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  View,
} from 'react-native';
import {BASE_URL, USER_UPLOADS} from '../../constants';
import {launchImageLibrary} from 'react-native-image-picker';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const UserProfile = () => {
  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [imageData, setImageData] = useState([]);
  const [image, setImage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setLoading] = useState(false);
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';

  useFocusEffect(
    React.useCallback(() => {
      fetchAccount();
    }, [uid]),
  );

  const fetchAccount = async () => {
    await axios
      .get(`${URL}?tag=get_account&userref=${uid}`)
      .then(response => {
        setUser(JSON.parse(response.data));
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'Network error. Please check your connection and try again',
        });
      });
  };

  function _updateAccount() {
    const parts = image.split('/');
    const imageUrl = parts[7].replace('${', '').replace('}', '');

    if (username === user.username && imageUrl === user.imageUrl) {
      setEditMode(false);
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append('tag', 'update_profile');
      formData.append('userref', uid);
      formData.append('image', {
        uri: imageData[0].uri,
        name: imageData[0].fileName,
        type: imageData[0].type,
      });
      formData.append('username', username);

      axios
        .post(BASE_URL, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log(response.data);
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
            text2: 'An error occured. Please try again',
          });
        })
        .finally(() => {
          setLoading(false);
          setEditMode(false);
          fetchAccount();
        });
    }
  }

  const pickImage = () => {
    if (editMode === false) {
      return;
    }

    launchImageLibrary(
      {
        selectionLimit: 1,
      },
      response => {
        if (response.error) {
          console.log('An error occured');
        } else if (response.didCancel) {
          console.log('Image picker dismissed');
        } else {
          // User picked images
          setImage(response.assets[0].uri);
          setImageData(response.assets);
        }
      },
    );
  };

  return (
    <View style={styles.profile}>
      <View style={styles.imageContainer}>
        <View style={styles.container}>
          {editMode ? (
            <>
              <Image source={{uri: image}} style={styles.image} />
              <TouchableHighlight
                underlayColor={'#CCCCCC'}
                style={styles.editbtn}
                onPress={() => {
                  pickImage();
                }}>
                <Icon name="camera-alt" size={18} color="#FFFFFF" />
              </TouchableHighlight>
            </>
          ) : (
            <>
              <Image
                source={{
                  uri: `${USER_UPLOADS}/${uid}/${user.imageUrl}`,
                }}
                style={styles.image}
              />
              <TouchableHighlight
                underlayColor={'#CCCCCC'}
                style={styles.editbtn}
                onPress={() => {
                  setEditMode(true);
                  setUsername(user.username);
                  setImage(`${USER_UPLOADS}/${uid}/${user.imageUrl}`);
                }}>
                <Icon name="mode-edit" size={18} color="#FFFFFF" />
              </TouchableHighlight>
            </>
          )}
        </View>
      </View>

      <View style={styles.userContainer}>
        {editMode ? (
          <>
            <TextInput
              style={styles.input}
              value={username}
              placeholder="Username"
              placeholderTextColor="#CCCCCC"
              onChangeText={value => setUsername(value)}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, {marginEnd: 4}]}
                onPress={() => {
                  setEditMode(false);
                }}>
                <Text style={{color: '#FFFFFF'}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, {marginStart: 4}]}
                onPress={() => {
                  // setEditMode(false);
                  _updateAccount();
                }}>
                {isLoading ? (
                  <ActivityIndicator size={'small'} color={'#FFFFFF'} />
                ) : (
                  <Text style={{color: '#FFFFFF'}}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.username}</Text>
            {user.is_verified === 1 ? (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={styles.verificationStatus}>Verified</Text>
                <Icon name="verified" size={18} color="#CCCCCC" />
              </View>
            ) : null}
          </>
        )}
      </View>
    </View>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 2,
  },
  userContainer: {
    flex: 4,
  },
  container: {
    flex: 2,
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
    borderRadius: 50,
    borderWidth: 2,
    height: 100,
    width: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  image: {
    borderRadius: 50,
    height: '100%',
    width: '100%',
  },
  editbtn: {
    backgroundColor: '#0E898B',
    borderRadius: 20,
    bottom: 0,
    elevation: 4,
    padding: 8,
    position: 'absolute',
    right: 0,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  verificationStatus: {
    color: '#0E898B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 8,
    flex: 1,
  },
  placeholder: {
    width: '60%',
    height: 15,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
    marginBottom: 8,
  },
});

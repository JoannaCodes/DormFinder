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
import {BASE_URL, AUTH_KEY} from '../../constants';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';

const UserProfile = ({uid}) => {
  let URL = BASE_URL;

  const [user, setUser] = useState('');
  const [username, setUsername] = useState('');
  const [imageData, setImageData] = useState([]);
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('success');
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setLoading] = useState(true);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     fetchAccount();
  //   }, []),
  // );

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    await axios
      .get(`${URL}?tag=get_account&userref=${uid}`, {
        headers: {
          'Auth-Key': AUTH_KEY,
        },
      })
      .then(async response => {
        const data = JSON.parse(response.data);
        const {id, identifier, password, ...profile} = data;
        setUser(profile);

        // Exclude image URLs from the data
        const {imageUrl, ...rest} = profile;

        await AsyncStorage.setItem('user-profile', JSON.stringify(rest));
      })
      .catch(async error => {
        console.error('Error occurred during the Axios request:', error);
        const storedUser = await AsyncStorage.getItem('user-profile');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setStatus('failed');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  function _updateAccount() {
    if (username === user.username && image === user.imageUrl) {
      setEditMode(false);
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append('tag', 'update_profile');
      formData.append('userref', uid);
      formData.append('username', username);

      if (image !== user.imageUrl) {
        formData.append('image', {
          uri: imageData[0].uri,
          name: imageData[0].fileName,
          type: imageData[0].type,
        });
      }

      axios
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
              text2: 'Profile updated',
            });
          } else if (message === 'failed') {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2:
                'Cannot update profile. Please check you network and try again',
            });
          }
        })
        .catch(error => {
          console.error('Error occurred during the Axios request:', error);
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

  return isLoading ? (
    <View style={styles.profile}>
      <>
        <View style={styles.imageContainer}>
          <View style={styles.container} />
        </View>

        <View style={styles.userContainer}>
          <View
            style={{
              width: '80%',
              height: 20,
              marginBottom: 8,
              borderRadius: 5,
              backgroundColor: COLORS.grey,
            }}
          />
          <View
            style={{
              width: '50%',
              height: 20,
              borderRadius: 5,
              backgroundColor: COLORS.grey,
            }}
          />
        </View>
      </>
    </View>
  ) : (
    <View style={styles.profile}>
      {status === 'failed' ? (
        <View style={styles.profile}>
          <>
            <View style={styles.imageContainer}>
              <View style={styles.container} />
            </View>

            <View style={styles.userContainer}>
              <View
                style={{
                  width: '80%',
                  height: 20,
                  marginBottom: 8,
                  borderRadius: 5,
                  backgroundColor: COLORS.grey,
                }}
              />
              <View
                style={{
                  width: '50%',
                  height: 20,
                  borderRadius: 5,
                  backgroundColor: COLORS.grey,
                }}
              />
            </View>
          </>
        </View>
      ) : (
        <>
          <View style={styles.imageContainer}>
            <View style={styles.container}>
              {editMode ? (
                <>
                  <Image source={{uri: image}} style={styles.image} />
                  <TouchableHighlight
                    underlayColor={COLORS.grey}
                    style={styles.editbtn}
                    onPress={() => {
                      pickImage();
                    }}>
                    <Icon name="camera-alt" size={18} color={COLORS.white} />
                  </TouchableHighlight>
                </>
              ) : (
                <>
                  <Image source={{uri: user.imageUrl}} style={styles.image} />
                  <TouchableHighlight
                    underlayColor={COLORS.grey}
                    style={styles.editbtn}
                    onPress={() => {
                      setEditMode(true);
                      setUsername(user.username);
                      setImage(user.imageUrl);
                    }}>
                    <Icon name="mode-edit" size={18} color={COLORS.white} />
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
                  placeholderTextColor={COLORS.grey}
                  onChangeText={value => setUsername(value)}
                />
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={[styles.button, {marginEnd: 4}]}
                    onPress={() => {
                      setEditMode(false);
                    }}>
                    <Text style={{color: COLORS.white}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, {marginStart: 4}]}
                    onPress={() => {
                      _updateAccount();
                    }}>
                    {isLoading ? (
                      <ActivityIndicator size={'small'} color={COLORS.white} />
                    ) : (
                      <Text style={{color: COLORS.white}}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.name}>{user.username}</Text>
                {user.is_verified === '1' ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={styles.verificationStatus}>Verified</Text>
                    <Icon name="verified" size={18} color={COLORS.teal} />
                  </View>
                ) : null}
              </>
            )}
          </View>
        </>
      )}
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
    backgroundColor: COLORS.grey,
    borderColor: COLORS.grey,
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
    backgroundColor: COLORS.teal,
    borderRadius: 20,
    borderColor: COLORS.grey,
    borderWidth: 2,
    bottom: 0,
    elevation: 4,
    padding: 8,
    position: 'absolute',
    right: 0,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'black',
  },
  verificationStatus: {
    color: 'gray',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginRight: 5,
    marginTop: 3,
  },
  input: {
    width: '100%',
    padding: 5,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    marginBottom: 8,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 8,
    flex: 1,
  },
  placeholder: {
    width: '60%',
    height: 15,
    borderRadius: 2,
    backgroundColor: COLORS.grey,
    borderColor: COLORS.grey,
    marginBottom: 8,
  },
});

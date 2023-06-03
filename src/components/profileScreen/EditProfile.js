/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../../../constants';
import {Formik} from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';

const Separator = () => {
  return (
    <View
      height={1}
      width={'100%'}
      backgroundColor={'#CCCCCC'}
      style={{marginVertical: 5}}
    />
  );
};

export default function EditProfile({route, navigation}) {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState(false);
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';

  useEffect(() => {
    fetchAccount();
  }, [uid]);

  const fetchAccount = async () => {
    axios
      .get(`${URL}?tag=get_account&userref=${uid}`)
      .then(response => {
        var output = JSON.parse(response.data);
        setUser(output.identifier);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'Dorm Finder',
          text2: 'Cannot retrieve account details. Please try again',
        });
      });
  };

  function _updateAccount(values) {
    Alert.alert('Dorm Finder', 'Continue updating account?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Update',
        onPress: async () => {
          setLoading(true);
          const formData = new FormData();
          formData.append('tag', 'update_account');
          formData.append('userref', uid);
          formData.append('identifier', values.loggedUser);

          await axios
            .post(BASE_URL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(response => {
              const message = response.data;

              if (message === 'success') {
                Toast.show({
                  type: 'success',
                  text1: 'Dorm Finder',
                  text2: 'Account updated',
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'Dorm Finder',
                  text2: 'Ooops! Something went wrong. Please try again',
                });
              }
            })
            .catch(error => {
              Toast.show({
                type: 'error',
                text1: 'Dorm Finder',
                text2: 'Cannot update account. Please try again',
              });
            })
            .finally(() => {
              setLoading(false);
              fetchAccount();
            });
        },
      },
    ]);
  }

  function _deleteAccount() {
    Alert.alert(
      'Dorm Finder',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'delete',
          onPress: async () => {
            const formData = new FormData();
            formData.append('tag', 'delete_account');
            formData.append('userref', uid);

            await axios
              .post(BASE_URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(async response => {
                const message = response.data;

                if (message === 'success') {
                  Toast.show({
                    type: 'success',
                    text1: 'Dorm Finder',
                    text2: 'Account deleted',
                  });

                  await AsyncStorage.setItem('user_data', JSON.stringify(userData));
                  await AsyncStorage.setItem('isUserLogin', 'true');
                  navigation.dispatch(StackActions.replace('Authentication'));
                } else {
                  Toast.show({
                    type: 'error',
                    text1: 'Dorm Finder',
                    text2: 'Ooops! Something went wrong. Please try again',
                  });
                }
              })
              .catch(error => {
                Toast.show({
                  type: 'error',
                  text1: 'Dorm Finder',
                  text2: 'Cannot delete account. Please try again',
                });
              });
          },
        },
      ],
    );
  }

  const validationSchema = Yup.object().shape({
    loggedUser: Yup.string()
      .required('This is required')
      .test('is-email-or-phone', 'Invalid', function (value) {
        // regular expressions to validate email and phone number
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        const phoneRegex = /^(09|\+639)\d{9}$/gm;

        if (emailRegex.test(value)) {
          return true; // input is a valid email address
        } else if (phoneRegex.test(value)) {
          return true; // input is a valid phone number
        }

        return false; // input is not a valid email or phone number
      }),
  });

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Formik
        enableReinitialize
        initialValues={{loggedUser: user}}
        validationSchema={validationSchema}
        onSubmit={_updateAccount}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <View style={styles.section}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={values.loggedUser}
                  placeholder="Email"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={handleChange('loggedUser')}
                  onBlur={handleBlur('loggedUser')}
                  keyboardType="email-address"
                />
                {errors.loggedUser && (
                  <Text style={styles.error}>{errors.loggedUser}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={
                values.loggedUser.length === 0 || values.loggedUser === user
              }
              style={[
                styles.button,
                {
                  backgroundColor:
                    values.loggedUser.length === 0 || values.loggedUser === user
                      ? '#CCCCCC'
                      : '#0E898B',
                },
              ]}>
              {loading ? (
                <ActivityIndicator size={'small'} color={'#FFFFFF'} />
              ) : (
                <Text style={{color: '#FFFFFF'}}>Submit</Text>
              )}
            </TouchableOpacity>
            <View style={styles.section}>
              <Separator />
              <View
                style={[
                  styles.section,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  },
                ]}>
                <Text style={{flex: 1, flexShrink: 1}}>
                  All of your account data, including your listings, will be
                  gone if you delete your account.
                </Text>
                <TouchableOpacity
                  style={styles.deletebtn}
                  onPress={_deleteAccount}>
                  <Text style={styles.deletebtnlbl}>Delete Account</Text>
                </TouchableOpacity>
              </View>
              <Separator />
            </View>
          </>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  section: {
    marginVertical: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    marginVertical: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  inputError: {
    borderColor: 'red',
  },
  error: {
    color: 'red',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 11,
  },
  deletebtn: {
    borderWidth: 1,
    borderColor: '#FF0000',
    padding: 10,
    marginStart: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletebtnlbl: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
});

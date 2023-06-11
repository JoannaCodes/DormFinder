/* eslint-disable no-unused-vars */
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

export default function EditProfile({user, onLogout}) {
  const [handle, setHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  let URL = BASE_URL;

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    setIsLoading(true);
    axios
      .get(`${URL}?tag=get_account&userref=${user}`)
      .then(response => {
        const data = JSON.parse(response.data);
        const {identifier, ...profile} = data;
        setHandle(identifier);
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: 'UniHive',
          text2: 'Cannot retrieve account details. Please try again.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function _updateAccount(values) {
    Alert.alert('UniHive', 'Continue updating account?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Update',
        onPress: async () => {
          setIsLoading(true);
          const formData = new FormData();
          formData.append('tag', 'update_account');
          formData.append('userref', user);
          formData.append('identifier', values.user);

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
                  text1: 'UniHive',
                  text2: 'Account updated',
                });
                fetchAccount();
              } else if (message === 'failed') {
                Toast.show({
                  type: 'error',
                  text1: 'UniHive',
                  text2: 'Unable to update account. Please Try Again.',
                });
              }
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
      },
    ]);
  }

  function _deleteAccount() {
    Alert.alert(
      'UniHive',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'delete',
          onPress: async () => {
            const formData = new FormData();
            formData.append('tag', 'delete_account');
            formData.append('userref', user);

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
                    text1: 'UniHive',
                    text2: 'Account deleted',
                  });

                  onLogout();
                } else if (message === 'failed') {
                  Toast.show({
                    type: 'error',
                    text1: 'UniHive',
                    text2: 'Unable to delete account. Please Try Again.',
                  });
                }
              });
          },
        },
      ],
    );
  }

  const validationSchema = Yup.object().shape({
    user: Yup.string()
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
        initialValues={{user: handle}}
        validationSchema={validationSchema}
        onSubmit={_updateAccount}>
        {({handleChange, handleBlur, handleSubmit, values, errors}) => (
          <>
            <View style={styles.section}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email or Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={
                    isLoading
                      ? 'Please wait, retrieving account...'
                      : values.user
                  }
                  placeholder="Email"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={handleChange('user')}
                  onBlur={handleBlur('user')}
                  keyboardType="email-address"
                />
                {errors.user && <Text style={styles.error}>{errors.user}</Text>}
              </View>
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={values.user.trim() === '' || values.user === handle}
              style={[
                styles.button,
                {
                  backgroundColor:
                    values.user.trim() === '' || values.user === handle
                      ? '#CCCCCC'
                      : '#0E898B',
                },
              ]}>
              {isLoading ? (
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

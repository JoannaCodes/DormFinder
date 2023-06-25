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
import COLORS from '../../../constants/colors';

const Separator = () => {
  return (
    <View
      height={1}
      width={'100%'}
      backgroundColor={COLORS.grey}
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
          text1: 'StudyHive',
          text2: 'Cannot retrieve account details. Please try again.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  function _updateAccount(values) {
    Alert.alert('StudyHive', 'Continue updating account?', [
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
                  text1: 'StudyHive',
                  text2: 'Account updated',
                });
                fetchAccount();
              } else if (message === 'failed') {
                Toast.show({
                  type: 'error',
                  text1: 'StudyHive',
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
      'StudyHive',
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
                    text1: 'StudyHive',
                    text2: 'Account deleted',
                  });

                  onLogout();
                } else if (message === 'failed') {
                  Toast.show({
                    type: 'error',
                    text1: 'StudyHive',
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
      .test('is-email', 'Invalid', function (value) {
        // regular expression to validate email address
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  
        if (emailRegex.test(value)) {
          if (value.endsWith('.com')) {
            return true; // input is a valid email address ending with ".com"
          } else {
            return false; // input is a valid email address but does not end with ".com"
          }
        }
  
        return false; // input is not a valid email address
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
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={
                    isLoading
                      ? 'Please wait, retrieving account...'
                      : values.user
                  }
                  placeholder="Email"
                  placeholderTextColor={COLORS.grey}
                  onChangeText={handleChange('user')}
                  onBlur={handleBlur('user')}
                  keyboardType="email-address"
                />
                {errors.user && <Text style={styles.error}>{errors.user}</Text>}
              </View>
            </View>
            <TouchableOpacity
  onPress={handleSubmit}
  disabled={
    values.user.trim() === '' ||
    values.user === handle ||
    !values.user.endsWith('.com') // Disable the submit button if the input doesn't end with ".com"
  }
  style={[
    styles.button,
    {
      backgroundColor:
        values.user.trim() === '' ||
        values.user === handle ||
        !values.user.endsWith('.com') // Change button color when disabled
          ? COLORS.grey
          : COLORS.teal,
                },
              ]}>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={{color: COLORS.white , fontFamily: 'Poppins-Regular', marginTop: 3}}>Submit</Text>
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
                <Text style={{flex: 1, flexShrink: 1, fontFamily: 'Poppins-Regular', fontSize: 13}}>
                Deleting your account will result in the permanent loss of all your data, including listings.
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
    backgroundColor: COLORS.white,
  },
  section: {
    marginVertical: 12,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 5,
  },
  inputContainer: {
    marginVertical: 12,
  },
  input: {
    width: '100%',
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    elevation: 2,
    fontFamily: 'Poppins-Regular',
  },
  inputError: {
    borderColor: COLORS.red,
  },
  error: {
    color: COLORS.red,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    borderRadius: 5,
    elevation: 4,
    padding: 8,
  },
  deletebtn: {
    borderWidth: 1,
    borderColor: COLORS.red,
    padding: 8,
    marginStart: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deletebtnlbl: {
    color: COLORS.red,
    fontFamily: 'Poppins-SemiBold',
  },
});

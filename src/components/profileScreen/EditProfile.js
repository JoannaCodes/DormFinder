/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Button,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BASE_URL} from '../../../constants';
import axios from 'axios';

export default function EditProfile() {
  const [user, setUser] = useState('');

  useEffect(() => {
    try {
      let URL = BASE_URL;
      let uid = 1;

      axios
        .get(`${URL}?tag=get_account&userref=${uid}`)
        .then(response => {
          var output = JSON.parse(response.data);
          setUser(output);
        })
        .catch(() => {
          Alert.alert('Message', 'Network Error, Please Try Again');
        });
    } catch (err) {
      Alert.alert('Error Message', err);
    }
  }, []);

  function _updateAccount(values) {
    Alert.alert('Update Account', 'Continue Updating Account?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Update',
        onPress: async () => {
          try {
            const formData = new FormData();
            formData.append('tag', 'update_account');
            formData.append('userref', 1);
            formData.append('identifier', values.loggedUser);

            await axios
              .post(BASE_URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              })
              .then(response => {
                Alert.alert('Message', response.data);
              });
          } catch (err) {
            Alert.alert('Error Message', err);
          }
        },
      },
    ]);
  }

  function _deleteAccount() {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'delete',
          onPress: async () => {
            try {
              const formData = new FormData();
              formData.append('tag', 'delete_account');
              formData.append('userref', 1);

              await axios
                .post(BASE_URL, formData, {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                })
                .then(response => {
                  Alert.alert('Message', response.data);
                });
            } catch (err) {
              Alert.alert('Error Message', err);
            }
          },
        },
      ],
    );
  }

  const Separator = () => <View style={styles.separator} />;

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
              <Text style={styles.label}>Email or Phone Number</Text>
              <TextInput
                style={[styles.input, errors.loggedUser && styles.inputError]}
                onChangeText={handleChange('loggedUser')}
                onBlur={handleBlur('loggedUser')}
                value={values.loggedUser}
              />
              {errors.loggedUser && (
                <Text style={styles.errorText}>{errors.loggedUser}</Text>
              )}
            </View>
            <Button onPress={handleSubmit} title="Save" color="#0E898B" />
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
  },
  section: {
    marginVertical: 24,
    justifyContent: 'space-between',
    width: '100%',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
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
  separator: {
    borderBottomColor: '#0E898B',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: 5,
  },
});

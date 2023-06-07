/* eslint-disable react-native/no-inline-styles */
import {
  ActivityIndicator,
  Alert,
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
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const ChangePassword = ({route}) => {
  const [loading, setLoading] = useState(false);
  let uid = 'LhVQ3FMv6d6lW';

  function _changePassword(values, {resetForm}) {
    Alert.alert('Dorm Finder', 'Continue changing password?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Change',
        onPress: async () => {
          setLoading(true);
          const formData = new FormData();
          formData.append('tag', 'change_password');
          formData.append('userref', uid);
          formData.append('currentpassword', values.currentpassword);
          formData.append('newpassword', values.newpassword);

          await axios
            .post(BASE_URL, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then(response => {
              if (response.data === 'success') {
                Toast.show({
                  type: 'success',
                  text1: 'Dorm Finder',
                  text2: 'Password updated',
                });
                resetForm();
              } else if (response.data === 'incorrect') {
                Toast.show({
                  type: 'warning',
                  text1: 'Dorm Finder',
                  text2: 'Current password is incorrect password',
                });
              }
            })
            .catch(error => {
              Toast.show({
                type: 'error',
                text1: 'Dorm Finder',
                text2: 'Oops! Cannot update password. Please try again.',
              });
            })
            .finally(() => {
              setLoading(false);
            });
        },
      },
    ]);
  }

  const validationSchema = Yup.object().shape({
    currentpassword: Yup.string().required('This is required'),
    newpassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('This is required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
      .required('This is required'),
  });

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{
          currentpassword: '',
          newpassword: '',
          confirmpassword: '',
        }}
        onSubmit={_changePassword}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <>
            <View style={styles.section}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={handleChange('currentpassword')}
                  onBlur={handleBlur('currentpassword')}
                  value={values.currentpassword}
                  secureTextEntry={true}
                />
                {touched.currentpassword && errors.currentpassword && (
                  <Text style={styles.error}>{errors.currentpassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Must be atleast 8 characters"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={handleChange('newpassword')}
                  onBlur={handleBlur('newpassword')}
                  value={values.newpassword}
                  secureTextEntry={true}
                />
                {touched.newpassword && errors.newpassword && (
                  <Text style={styles.error}>{errors.newpassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Must be atleast 8 characters"
                  placeholderTextColor="#CCCCCC"
                  onChangeText={handleChange('confirmpassword')}
                  onBlur={handleBlur('confirmpassword')}
                  value={values.confirmpassword}
                  secureTextEntry={true}
                />
                {touched.confirmpassword && errors.confirmpassword && (
                  <Text style={styles.error}>{errors.confirmpassword}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              {loading ? (
                <ActivityIndicator size={'small'} color={'#FFFFFF'} />
              ) : (
                <Text style={{color: '#FFFFFF'}}>Save</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
};

export default ChangePassword;

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
});

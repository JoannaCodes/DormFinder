import {BASE_URL} from '../../../constants';
import {Formik} from 'formik';
import {Alert, Button, StyleSheet, Text, TextInput, View} from 'react-native';
import {Toast} from 'react-native-toast-message';
import * as Yup from 'yup';
import axios from 'axios';
import React from 'react';

const ChangePassword = ({route}) => {
  function _changePassword(values) {
    Alert.alert('Change Password', 'Continue Updating Account?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Change',
        onPress: async () => {
          try {
            const formData = new FormData();
            formData.append('tag', 'change_password');
            formData.append('userref', 1);
            formData.append('currentpassword', values.currentpassword);
            formData.append('newpassword', values.newpassword);

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
              });
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Dorm Finder',
              text2: 'An error occured. Please try again.',
            });
          }
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
            <Button onPress={handleSubmit} title="Save" color="#0E898B" />
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
});

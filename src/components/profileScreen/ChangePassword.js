import {StyleSheet, View, Text, TextInput, Alert, Button} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BASE_URL} from '../../../constants';
import axios from 'axios';

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
                Alert.alert('Message', response.data);
                console.log(response.data);
              });
          } catch (err) {
            console.log(err);
          }
        },
      },
    ]);
  }

  const validationSchema = Yup.object().shape({
    currentpassword: Yup.string().required('Current password is required'),
    newpassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('newpassword'), null], 'Passwords must match')
      .required('Confirm new password is required'),
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
                  style={[
                    styles.input,
                    touched.currentpassword &&
                      errors.currentpassword &&
                      styles.inputError,
                  ]}
                  onChangeText={handleChange('currentpassword')}
                  onBlur={handleBlur('currentpassword')}
                  value={values.currentpassword}
                  secureTextEntry={true}
                />
                {touched.currentpassword && errors.currentpassword && (
                  <Text style={styles.errorText}>{errors.currentpassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.newpassword && errors.newpassword
                      ? styles.inputError
                      : null,
                  ]}
                  onChangeText={handleChange('newpassword')}
                  onBlur={handleBlur('newpassword')}
                  value={values.newpassword}
                  secureTextEntry={true}
                />
                {touched.newpassword && errors.newpassword && (
                  <Text style={styles.errorText}>{errors.newpassword}</Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={[
                    styles.input,
                    touched.confirmpassword &&
                      errors.confirmpassword &&
                      styles.inputError,
                  ]}
                  onChangeText={handleChange('confirmpassword')}
                  onBlur={handleBlur('confirmpassword')}
                  value={values.confirmpassword}
                  secureTextEntry={true}
                />
                {touched.confirmpassword && errors.confirmpassword && (
                  <Text style={styles.errorText}>{errors.confirmpassword}</Text>
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
    marginVertical: 24,
    justifyContent: 'space-between',
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
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
    marginBottom: 10,
  },
});

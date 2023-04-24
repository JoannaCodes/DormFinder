/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, View, Text, TextInput} from 'react-native';
import React from 'react';
import {PrimaryBtn} from '../others/Buttons';
import {Formik} from 'formik';
import * as Yup from 'yup';

const ChangePassword = ({route}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    currentPass: '12345',
    newPass: '67890',
    confirmPass: '67890',
  };

  const validationSchema = Yup.object().shape({
    currentPass: Yup.string().required('Current password is required'),
    newPass: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPass: Yup.string()
      .oneOf([Yup.ref('newPass'), null], 'Passwords must match')
      .required('Confirm new password is required'),
  });

  const handleFormSubmit = values => {
    setIsLoading(true);
    console.log('Form values:', values);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
        validationSchema={validationSchema}>
        {({handleChange, handleSubmit, values, errors, touched}) => (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Current Password</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.currentPass &&
                    errors.currentPass &&
                    styles.inputError,
                ]}
                onChangeText={handleChange('currentPass')}
                value={values.currentPass}
                secureTextEntry={true}
              />
              {touched.currentPass && errors.currentPass && (
                <Text style={styles.errorText}>{errors.currentPass}</Text>
              )}

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.newPass && errors.newPass && styles.inputError,
                ]}
                onChangeText={handleChange('newPass')}
                value={values.newPass}
                secureTextEntry={true}
              />
              {touched.newPass && errors.newPass && (
                <Text style={styles.errorText}>{errors.newPass}</Text>
              )}

              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={[
                  styles.input,
                  touched.confirmPass &&
                    errors.confirmPass &&
                    styles.inputError,
                ]}
                onChangeText={handleChange('confirmPass')}
                value={values.confirmPass}
                secureTextEntry={true}
              />
              {touched.confirmPass && errors.confirmPass && (
                <Text style={styles.errorText}>{errors.confirmPass}</Text>
              )}
            </View>

            <View style={styles.section}>
              <PrimaryBtn
                title={isLoading ? 'Loading...' : 'Update Password'}
                onPress={handleSubmit}
                buttonStyle={{height: 45}}
                textStyle={{textAlign: 'center'}}
                textColor="#FFFFFF"
              />
            </View>
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
  },
  section: {
    padding: 16,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 4,
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

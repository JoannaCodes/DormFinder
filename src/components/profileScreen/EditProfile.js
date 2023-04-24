/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {BASE_URL} from '../../../constants';
import axios from 'axios';

export default function EditProfile() {
  async function _updateAccount(values) {
    try {
      const formData = new FormData();
      formData.append('tag', 'update_account');
      formData.append('userref', 62);
      formData.append('loginCredential', values.loginCredential);

      const response = await axios.post(BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      Alert.alert('Message', response.data);
    } catch (err) {
      console.log(err);
    }
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
              formData.append('userref', 62);

              const response = await axios.post(BASE_URL, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
              Alert.alert('Message', response.data);
            } catch (err) {
              console.log(err);
            }
          },
        },
      ],
    );
  }

  const Separator = () => <View style={styles.separator} />;

  const validationSchema = Yup.object().shape({
    loginCredential: Yup.string()
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
        initialValues={{loginCredential: 'user@gmail.com'}}
        validationSchema={validationSchema}
        onSubmit={_updateAccount}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View style={styles.section}>
            <Text style={styles.label}>Email or Phone Number</Text>
            <TextInput
              style={styles.input}
              onChangeText={handleChange('loginCredential')}
              onBlur={handleBlur('loginCredential')}
              value={values.loginCredential}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {errors.email && touched.email && (
              <Text style={{color: 'red'}}>{errors.email}</Text>
            )}
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonlbl}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
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
          All of your account data, including your listings, will be gone if you
          delete your account.
        </Text>
        <TouchableOpacity style={styles.deletebtn} onPress={_deleteAccount}>
          <Text style={styles.deletebtnlbl}>Delete Account</Text>
        </TouchableOpacity>
      </View>
      <Separator />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    padding: 16,
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
    marginBottom: 20,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  button: {
    backgroundColor: '#0E898B',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    elevation: 4,
  },
  buttonlbl: {
    color: '#FFFFFF',
    fontWeight: 'bold',
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

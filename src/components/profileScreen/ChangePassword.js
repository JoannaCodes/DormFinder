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
import {BASE_URL, AUTH_KEY} from '../../../constants';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import COLORS from '../../../constants/colors';
import ForgotPasswordModal from '../modals/ForgotPasswordModal';

const ChangePassword = ({route}) => {
  const {user} = route.params;
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  function _changePassword(values, {resetForm}) {
    Alert.alert('StudyHive', 'Continue changing password?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Change',
        onPress: async () => {
          setLoading(true);
          const formData = new FormData();
          formData.append('tag', 'change_password');
          formData.append('userref', user);
          formData.append('currentpassword', values.currentpassword);
          formData.append('newpassword', values.newpassword);

          await axios
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
                  text2: 'Password updated.',
                });
                resetForm();
              } else if (message === 'incorrect') {
                Toast.show({
                  type: 'warning',
                  text1: 'StudyHive',
                  text2: 'Current password is incorrect.',
                });
              } else {
                Toast.show({
                  type: 'error',
                  text1: 'StudyHive',
                  text2: 'Unable to update password. Please try again.',
                });
              }
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
                  placeholderTextColor={COLORS.grey}
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
                  placeholderTextColor={COLORS.grey}
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
                  placeholderTextColor={COLORS.grey}
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
                <ActivityIndicator size={'small'} color={COLORS.white} />
              ) : (
                <Text style={{color: COLORS.white, fontFamily: 'Poppins-SemiBold', marginTop: 5}}>Save</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </Formik>
      <TouchableOpacity
        style={{marginTop: 10}}
        onPress={() => {
          setModalVisible(true);
        }}>
        <Text
          style={{
            color: COLORS.teal,
            fontFamily: 'Poppins-SemiBold',
            textAlign: 'center',
          }}>
          Forget Your Password?
        </Text>
      </TouchableOpacity>
      <ForgotPasswordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
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
    fontFamily: 'Poppins-Regular'
  },
  inputError: {
    borderColor: COLORS.red,
  },
  error: {
    color: COLORS.red,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 5,
    elevation: 4,
    padding: 5,
  },
});

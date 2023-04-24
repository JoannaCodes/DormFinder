/* eslint-disable react-native/no-inline-styles */
import {StyleSheet, Text, TextInput, View} from 'react-native';
import React from 'react';
import {PrimaryBtn, GhostBtn} from '../others/Buttons';
import {Formik} from 'formik';

const EditProfile = ({route}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const initialValues = {
    email: 'john@example.com',
    phone: '09123456789',
  };

  const handleFormSubmit = values => {
    setIsLoading(true);
    console.log('Form values:', values);
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <Formik initialValues={initialValues} onSubmit={handleFormSubmit}>
        {({handleChange, handleSubmit, values}) => (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('name')}
                value={values.name}
                placeholder="Full Name"
              />
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                value={values.email}
                placeholder="user@gmail.com"
              />
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('phone')}
                value={values.phone}
                placeholder="+63"
                keyboardType="numeric"
              />
            </View>
            <View
              style={[
                styles.section,
                {flexDirection: 'row', justifyContent: 'space-between'},
              ]}>
              <View style={{width: '40%', justifyContent: 'center'}}>
                <Text style={styles.label}>Delete Account?</Text>
                <Text style={{fontSize: 10}}>
                  All of your account data, including your listing, will be gone
                  if you delete your account.
                </Text>
              </View>

              <View style={{width: '50%', justifyContent: 'center'}}>
                <GhostBtn
                  title="Delete Account"
                  buttonStyle={{height: 45}}
                  textStyle={{textAlign: 'center'}}
                  textColor="#FF0000"
                  borderColor="#FF0000"
                />
              </View>
            </View>

            <View style={styles.section}>
              <PrimaryBtn
                title={isLoading ? 'Loading...' : 'Update Profile'}
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

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  input: {
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

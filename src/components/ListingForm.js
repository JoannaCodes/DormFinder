/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  View,
  KeyboardAvoidingView,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
  Button,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';

import {BASE_URL, DORM_DATA, HEI, AMENITIES} from '../../constants';
import {Formik} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const ListingForm = ({route, navigation}) => {
  const {dormref, userref, editmode} = route.params;

  const [heiOpen, setHeiOpen] = useState(false);
  const [amenititesOpen, setAmenitiesOpen] = useState(false);

  const [initialValues, setInitialValues] = useState(DORM_DATA);
  const [hei, setHei] = useState(HEI);
  const [selectedHei, setSelectedHei] = useState([]);
  const [amenities, setAmenities] = useState(AMENITIES);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const Separator = ({title}) => {
    return (
      <View style={styles.separator}>
        <View style={styles.line} />
        <Text style={{marginHorizontal: 5}}>{title}</Text>
        <View style={styles.line} />
      </View>
    );
  };

  const validationSchema = Yup.object().shape({
    address: Yup.string().required('This is required'),
    advance_deposit: Yup.string().required('This is required'),
    amenities: Yup.array()
      .required('Please select at least one amenity')
      .min(1, 'Please select at least one amenity'),
    description: Yup.string().required('This is required'),
    hei: Yup.array()
      .required('Please select at least one hei')
      .min(1, 'Please select at least one hei'),
    images: Yup.array()
      .required('Please select at least one image')
      .min(1, 'Please select at least one image'),
    minimum_stay: Yup.string().required('This is required'),
    name: Yup.string().required('This is required'),
    price: Yup.string().required('This is required'),
    slots: Yup.string().required('This is required'),
    utilities: Yup.string().required('This is required'),
  });

  const onHeiOpen = useCallback(() => {
    setAmenitiesOpen(false);
  }, []);

  const onAmenitiesOpen = useCallback(() => {
    setHeiOpen(false);
  }, []);

  useEffect(() => {
    if (editmode) {
      try {
        axios
          .get(
            `${BASE_URL}?tag=get_dorm_details&dormref=${dormref}&userref=${userref}`,
          )
          .then(response => {
            var output = JSON.parse(response.data);
            console.log(output);

            const fetchedHei = output.hei.split(', ');
            setSelectedHei(fetchedHei);

            const fetchedAmenities = output.amenities.split(', ');
            setSelectedAmenities(fetchedAmenities);

            setInitialValues({
              address: output.address,
              advance_deposit: output.advance_deposit,
              amenities: selectedAmenities,
              curfew: output.curfew,
              desc: output.desc,
              hei: selectedHei,
              minimum_stay: output.minimum_stay,
              name: output.name,
              pets: output.pets,
              price: output.price,
              security_deposit: output.security_deposit,
              slots: output.slots,
              utilities: output.utilities,
              visitors: output.visitors,
            });
          })
          .catch(err => {
            console.error(err);
          });
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  function _createListing(values) {
    Toast.show({
      type: 'success',
      text1: 'Dorm Listed!',
      text2: 'Testing Toast 👋',
    });
  }

  return (
    <ScrollView nestedScrollEnabled style={styles.scrollcontainer}>
      <KeyboardAvoidingView style={styles.container}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={_createListing}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            touched,
            errors,
          }) => (
            <>
              <Separator title="Basic Information" />
              <TextInput
                style={styles.input}
                value={values.name}
                placeholder="Establishment Name"
                placeholderTextColor="#CCCCCC"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
              />
              {errors.name && <Text style={styles.error}>{errors.name}</Text>}

              <View style={styles.section}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.price}
                    placeholder="Price"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('price')}
                    onBlur={handleBlur('price')}
                    keyboardType="numeric"
                  />
                  {errors.price && (
                    <Text style={styles.error}>{errors.price}</Text>
                  )}
                </View>
                <View style={{width: 16}} />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.slots}
                    placeholder="Slots Available"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('slots')}
                    onBlur={handleBlur('slots')}
                    keyboardType="numeric"
                  />
                  {errors.slots && (
                    <Text style={styles.error}>{errors.slots}</Text>
                  )}
                </View>
              </View>

              <TextInput
                style={styles.input}
                value={values.desc}
                placeholder="Listing Description"
                placeholderTextColor="#CCCCCC"
                onChangeText={handleChange('desc')}
                onBlur={handleBlur('desc')}
                height={150}
                textAlignVertical="top"
                multiline
              />
              {errors.desc && <Text style={styles.error}>{errors.desc}</Text>}

              <DropDownPicker
                mode="BADGE"
                listMode="SCROLLVIEW"
                placeholder="Select Nearby HEIs"
                zIndex={3000}
                zIndexInverse={1000}
                badgeColors={['#0E898B']}
                badgeDotColors={['white']}
                placeholderStyle={{color: 'gray'}}
                badgeTextStyle={{color: 'white'}}
                style={{borderWidth: 0, elevation: 2, borderRadius: 5}}
                containerStyle={{marginVertical: 8}}
                dropDownContainerStyle={{
                  borderWidth: 0,
                  borderTopWidth: 1,
                  borderTopColor: '#dfdfdf',
                  marginTop: 5,
                  elevation: 2,
                }}
                open={heiOpen}
                onOpen={onHeiOpen}
                value={selectedHei}
                items={hei}
                setOpen={setHeiOpen}
                setValue={setSelectedHei}
                setItems={setHei}
                multiple={true}
              />
              {errors.hei && <Text style={styles.error}>{errors.hei}</Text>}

              <Separator title="Amenities" />

              <DropDownPicker
                mode="BADGE"
                listMode="SCROLLVIEW"
                dropDownDirection="BOTTOM"
                placeholder="Select Amenities"
                zIndex={2000}
                zIndexInverse={2000}
                badgeColors={['#0E898B']}
                badgeDotColors={['white']}
                placeholderStyle={{color: 'gray'}}
                badgeTextStyle={{color: 'white'}}
                style={{borderWidth: 0, elevation: 2, borderRadius: 5}}
                containerStyle={{marginVertical: 8}}
                dropDownContainerStyle={{
                  borderWidth: 0,
                  borderTopWidth: 1,
                  borderTopColor: '#dfdfdf',
                  marginTop: 5,
                  elevation: 2,
                }}
                open={amenititesOpen}
                onOpen={onAmenitiesOpen}
                value={selectedAmenities}
                items={amenities}
                setOpen={setAmenitiesOpen}
                setValue={setSelectedAmenities}
                setItems={setAmenities}
                multiple={true}
              />
              {errors.amenities && (
                <Text style={styles.error}>{errors.amenities}</Text>
              )}

              <Separator title="Establishment Rules" />

              {/* Checkbox */}

              <Separator title="Payment and Duration Terms" />
              <View style={styles.section}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.advance_deposit}
                    placeholder="Advance Deposit"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('advance_deposit')}
                    onBlur={handleBlur('advance_deposit')}
                  />
                  {errors.advance_deposit && (
                    <Text style={styles.error}>{errors.advance_deposit}</Text>
                  )}
                </View>
                <View style={{width: 16}} />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.security_deposit}
                    placeholder="Security Deposit"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('security_deposit')}
                    onBlur={handleBlur('security_deposit')}
                  />
                  {errors.security_deposit && (
                    <Text style={styles.error}>{errors.security_deposit}</Text>
                  )}
                </View>
              </View>
              <View style={styles.section}>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.utilities}
                    placeholder="Utility Exclusivity"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('utilities')}
                    onBlur={handleBlur('utilities')}
                  />
                  {errors.utilities && (
                    <Text style={styles.error}>{errors.utilities}</Text>
                  )}
                </View>
                <View style={{width: 16}} />
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={values.minimum_stay}
                    placeholder="Minimum Stay"
                    placeholderTextColor="#CCCCCC"
                    onChangeText={handleChange('minimum_stay')}
                    onBlur={handleBlur('minimum_stay')}
                  />
                  {errors.minimum_stay && (
                    <Text style={styles.error}>{errors.minimum_stay}</Text>
                  )}
                </View>
              </View>
              <View style={{marginTop: 16}}>
                <Button
                  title="Submit"
                  color="#0E898B"
                  onPress={_createListing}
                />
              </View>
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ListingForm;

const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  scrollcontainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 8,
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

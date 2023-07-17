/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL, AUTH_KEY} from '../../constants';
import {HEI, PAYMENTINTERVAL} from '../../constants/values';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect, useCallback} from 'react';
import Toast from 'react-native-toast-message';
import COLORS from '../../constants/colors';

const Separator = ({title}) => {
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text style={[styles.label, {marginHorizontal: 5}]}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const ListingForm = ({route, navigation}) => {
  const {dormref, userref, editmode} = route.params;

  const [heiOpen, setHeiOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  const onHeiOpen = useCallback(() => {
    setPaymentOpen(false);
  }, []);

  const onPaymentOpen = useCallback(() => {
    setHeiOpen(false);
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const [hei, setHei] = useState(HEI);
  const [payment, setPayment] = useState(PAYMENTINTERVAL);

  const [images, setImages] = useState([]);
  const [selectedHei, setSelectedHei] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [initialValues, setInitialValues] = useState({
    address: '',
    advance_deposit: '',
    desc: '',
    minimum_stay: '',
    name: '',
    price: '',
    security_deposit: '',
    slots: '',
    payment_policy: '',
  });
  const [rules, setRules] = React.useState({
    pets: false,
    visitors: false,
    curfew: false,
  });
  const [amenities, setAmenities] = React.useState({
    aircon: false,
    elevator: false,
    beddings: false,
    kitchen: false,
    laundry: false,
    lounge: false,
    parking: false,
    security: false,
    study_room: false,
    wifi: false,
  });

  const amenitiesContents = [
    {name: 'aircon', label: 'Air Conditioning'},
    {name: 'elevator', label: 'Elevator'},
    {name: 'beddings', label: 'Beddings'},
    {name: 'kitchen', label: 'Kitchen'},
    {name: 'laundry', label: 'Laundry'},
    {name: 'lounge', label: 'Lounge'},
    {name: 'parking', label: 'Parking'},
    {name: 'security', label: 'Security'},
    {name: 'study_room', label: 'Study Room'},
    {name: 'wifi', label: 'WiFi'},
  ];

  const halfLength = Math.ceil(amenitiesContents.length / 2);
  const firstColumn = amenitiesContents.slice(0, halfLength);
  const secondColumn = amenitiesContents.slice(halfLength);

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    slots: false,
    desc: false,
    images: false,
    hei: false,
    amenities: false,
    payment_duration: false,
    payment_policy: false,
  });

  useEffect(() => {
    if (editmode) {
      fetchDormDetails();
    }
  }, [dormref, editmode]);

  const fetchDormDetails = async () => {
    await axios
      .get(`${BASE_URL}?tag=get_dorm_details&dormref=${dormref}`, {
        headers: {
          'Auth-Key': AUTH_KEY,
        },
      })
      .then(response => {
        const data = JSON.parse(response.data);
        const fetchedHei = data.hei.split(',');

        // Set initial values
        setInitialValues(prevState => ({
          ...prevState,
          address: data.address,
          advance_deposit: data.adv_dep,
          desc: data.desc,
          minimum_stay: data.min_stay,
          name: data.name,
          price: data.price,
          security_deposit: data.sec_dep,
          slots: data.slots.toString(),
          utilities: data.util,
        }));

        // Set selected HEI
        setSelectedHei(fetchedHei);

        // Set checkboxes
        setRules({
          pets: Boolean(parseInt(data.pets, 10)),
          visitors: Boolean(parseInt(data.visitors, 10)),
          curfew: Boolean(parseInt(data.curfew, 10)),
        });

        // Set Amenities
        setAmenities({
          aircon: Boolean(parseInt(data.aircon, 10)),
          elevator: Boolean(parseInt(data.elevator, 10)),
          beddings: Boolean(parseInt(data.beddings, 10)),
          kitchen: Boolean(parseInt(data.kitchen, 10)),
          laundry: Boolean(parseInt(data.laundry, 10)),
          lounge: Boolean(parseInt(data.lounge, 10)),
          parking: Boolean(parseInt(data.parking, 10)),
          security: Boolean(parseInt(data.security, 10)),
          study_room: Boolean(parseInt(data.study_room, 10)),
          wifi: Boolean(parseInt(data.wifi, 10)),
        });
      });
  };

  async function _createListing() {
    const formData = new FormData();

    if (validateInputs()) {
      setIsLoading(true);

      formData.append('tag', 'post_dorm');

      // Append ids
      formData.append('userref', userref);

      // Append text inputs
      for (const key in initialValues) {
        formData.append(key, initialValues[key]);
      }

      // Append selected HEI
      formData.append('hei', selectedHei.join(','));

      // Append amenities
      for (const key in amenities) {
        formData.append(key, amenities[key]);
      }

      // Append rules
      for (const key in rules) {
        formData.append(key, rules[key]);
      }

      // Append Payment Duration
      formData.append('payment_duration', selectedPayment);

      // Append images
      images.forEach((item, i) => {
        formData.append('images[]', {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });

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
              text2: 'Dorm Listed',
            });
            navigation.goBack();
          } else if (message === 'failed') {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2: 'Dorm not listed. Please try again.',
            });
          }
        })
        .catch(error => {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'An error occured. Please try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  async function _updateListing() {
    const formData = new FormData();

    if (validateInputs()) {
      setIsLoading(true);
      formData.append('tag', 'update_dorm');

      // Append ids
      formData.append('dormref', dormref);
      formData.append('userref', userref);

      // Append text inputs
      for (const key in initialValues) {
        formData.append(key, initialValues[key]);
      }

      // Append selected HEI
      formData.append('hei', selectedHei.join(','));

      // Append rules
      for (const key in rules) {
        formData.append(key, rules[key]);
      }

      // Append payment Duration
      formData.append('payment_duration', selectedPayment);

      // Append amenities
      for (const key in amenities) {
        formData.append(key, amenities[key]);
      }

      // Append images
      images.forEach((item, i) => {
        formData.append('images[]', {
          uri: item.uri,
          type: item.type,
          name: item.name,
        });
      });

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
              text2: 'Dorm Updated',
            });
            navigation.goBack();
          } else if (message === 'failed') {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2: 'Dorm not updated. Please try again.',
            });
          }
        })
        .catch(error => {
          console.log(error);
          Toast.show({
            type: 'error',
            text1: 'StudyHive',
            text2: 'An error occured. Please try again.',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  const validateInputs = () => {
    const requiredFields = [
      'name',
      'price',
      'slots',
      'address',
      'desc',
      'payment_policy',
    ];
    const newErrors = {};

    let isValid = true;
    for (const field of requiredFields) {
      if (!initialValues[field]) {
        newErrors[field] = true;
        isValid = false;
      } else {
        newErrors[field] = false;
      }
    }

    if (!initialValues.address.includes('Manila')) {
      newErrors.address = true;
      isValid = false;
      Toast.show({
        type: 'info',
        text1: 'StudyHive',
        text2: 'The scope of the app is limited to Manila City only.',
      });
    } else {
      newErrors.address = false;
    }

    // Upload images is optional on edit mode
    if (!editmode) {
      if (images.length === 0) {
        newErrors.images = true;
        isValid = false;
      } else {
        newErrors.images = false;
      }
    }

    if (selectedHei.length === 0) {
      newErrors.hei = true;
      isValid = false;
    } else {
      newErrors.hei = false;
    }

    if (selectedPayment === '') {
      newErrors.payment_duration = true;
      isValid = false;
    } else {
      newErrors.payment_duration = false;
    }

    const amenitiesValues = Object.values(amenities);
    const isAllFalse = amenitiesValues.every(value => value === false);

    if (isAllFalse) {
      newErrors.amenities = true;
      isValid = false;
    } else {
      newErrors.amenities = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      let toastMessage = '';
      if (!initialValues.address || !initialValues.address.includes('Manila')) {
        toastMessage = 'Please enter a valid address within Manila city.';
      } else {
        toastMessage =
          'Validation Error. Please fill in all the required fields.';
      }
      Toast.show({
        type: 'error',
        text1: 'StudyHive',
        text2: toastMessage,
      });
    }

    return isValid;
  };

  const handleRulesToggle = name => {
    setRules(prevState => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleAmenitiesToggle = name => {
    setAmenities(prevState => ({
      ...prevState,
      [name]: !prevState[name],
    }));
  };

  const handleTextInputChange = (name, value) => {
    setInitialValues(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const pickImage = () => {
    launchImageLibrary(
      {
        selectionLimit: 0,
      },
      response => {
        if (response.error) {
          console.log('An error occured');
        } else if (response.didCancel) {
          console.log('Image picker dismissed');
        } else {
          // const assets = response.assets;
          // setImages(assets);
          const selectedImages = response.assets.map(asset => ({
            uri: asset.uri,
            type: asset.type,
            name: asset.fileName,
          }));
          setImages(selectedImages);
        }
      },
    );
  };

  const removeItem = id => {
    let arr = images.filter(function (item) {
      return item.name !== id;
    });
    setImages(arr);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => removeItem(item.name)}>
        <View style={[styles.card]}>
          <Image source={{uri: item.uri}} style={styles.image} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {editmode ? (
          <>
            <Icon name="image" size={30} color={COLORS.grey} />
            <Text style={styles.emptyTitle}>
              Uploaded images will overwrite existing images. Leave blank if no
              changes.
            </Text>
            <Text style={styles.emptyTitle}>Tap the image to remove it</Text>
          </>
        ) : (
          <>
            <Icon name="image" size={30} color={COLORS.grey} />
            <Text style={styles.emptyTitle}>Upload dorm images</Text>
            <Text style={styles.emptyTitle}>Tap the image to remove it</Text>
          </>
        )}
      </View>
    );
  };

  const layoutAnimConfig = {
    duration: 100,
    update: {
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 100,
      type: LayoutAnimation.Types.easeInEaseOut,
      property: LayoutAnimation.Properties.opacity,
    },
  };

  return (
    <ScrollView style={styles.scrollcontainer}>
      <KeyboardAvoidingView style={styles.container}>
        {/* Images */}
        <SafeAreaView
          style={[styles.cardContainer, errors.images && styles.error]}>
          <FlatList
            contentContainerStyle={styles.flatList}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            data={images}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            ItemSeparatorComponent={() => {
              return <View style={{flex: 1, width: 10}} />;
            }}
          />
        </SafeAreaView>
        <View style={{marginTop: 16}}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={[styles.label, {color: COLORS.white}]}>
              Upload Images
            </Text>
          </TouchableOpacity>
        </View>
        {/* Name */}
        <Separator title="Basic Information" />
        <TextInput
          style={[styles.input, errors.name && styles.error]}
          value={initialValues.name}
          placeholder="Establishment Name"
          placeholderTextColor={COLORS.grey}
          onChangeText={value => handleTextInputChange('name', value)}
        />
        <View style={styles.section}>
          {/* Price */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.price && styles.error]}
              value={initialValues.price}
              placeholder="Rent per month"
              placeholderTextColor={COLORS.grey}
              keyboardType="numeric"
              onChangeText={value => handleTextInputChange('price', value)}
            />
          </View>
          <View style={{width: 16}} />
          {/* Slots */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.slots && styles.error]}
              value={initialValues.slots}
              placeholder="Slots Available"
              placeholderTextColor={COLORS.grey}
              keyboardType="numeric"
              onChangeText={value => handleTextInputChange('slots', value)}
            />
          </View>
        </View>
        {/* Address */}
        <View
          style={{
            backgroundColor: COLORS.teal,
            padding: 5,
            borderRadius: 5,
            marginTop: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="info" color={COLORS.white} size={16} />
            <Text
              style={[
                styles.label,
                {fontSize: 12, marginStart: 5, color: COLORS.white},
              ]}>
              Example: 303 Recto Ave, Binondo, Manila
            </Text>
          </View>
        </View>
        <TextInput
          style={[styles.input, errors.address && styles.error]}
          value={initialValues.address}
          placeholder="Address"
          placeholderTextColor={COLORS.grey}
          height={75}
          textAlignVertical="top"
          multiline
          onChangeText={value => handleTextInputChange('address', value)}
        />
        {/* Description */}
        <TextInput
          style={[styles.input, errors.desc && styles.error]}
          value={initialValues.desc}
          placeholder="Listing Description"
          placeholderTextColor={COLORS.grey}
          height={150}
          textAlignVertical="top"
          multiline
          onChangeText={value => handleTextInputChange('desc', value)}
        />
        {/* Payment Duration */}
        <DropDownPicker
          mode="BADGE"
          listMode="SCROLLVIEW"
          placeholder="Select payment period"
          placeholderStyle={[styles.label, {color: COLORS.grey}]}
          open={paymentOpen}
          onOpen={onPaymentOpen}
          badgeColors={[COLORS.teal]}
          badgeDotColors={[COLORS.white]}
          badgeTextStyle={[styles.label, {color: COLORS.white}]}
          style={[styles.dropdown, errors.payment_duration && styles.error]}
          containerStyle={{marginVertical: 8}}
          dropDownContainerStyle={{
            borderWidth: 0,
            borderTopWidth: 1,
            borderTopColor: COLORS.grey,
            marginTop: 5,
            elevation: 2,
          }}
          textStyle={[styles.label, {color: COLORS.darkgrey}]}
          value={selectedPayment}
          items={payment}
          setOpen={setPaymentOpen}
          setValue={setSelectedPayment}
          setItems={setPayment}
        />
        {/* Payment Terms */}
        <TextInput
          style={[styles.input, errors.payment_policy && styles.error]}
          value={initialValues.payment_policy}
          placeholder="Listing Payment Policy"
          placeholderTextColor={COLORS.grey}
          height={150}
          textAlignVertical="top"
          multiline
          onChangeText={value => handleTextInputChange('payment_policy', value)}
        />
        {/* HEIs */}
        <DropDownPicker
          mode="BADGE"
          listMode="SCROLLVIEW"
          placeholder="Select Nearby HEIs"
          placeholderStyle={[styles.label, {color: COLORS.grey}]}
          open={heiOpen}
          onOpen={onHeiOpen}
          badgeColors={[COLORS.teal]}
          badgeDotColors={[COLORS.white]}
          badgeTextStyle={[styles.label, {color: COLORS.white}]}
          style={[styles.dropdown, errors.hei && styles.error]}
          containerStyle={{marginVertical: 8}}
          dropDownContainerStyle={{
            borderWidth: 0,
            borderTopWidth: 1,
            borderTopColor: COLORS.grey,
            marginTop: 5,
            elevation: 2,
          }}
          textStyle={[styles.label, {color: COLORS.darkgrey}]}
          value={selectedHei}
          items={hei}
          setOpen={setHeiOpen}
          setValue={setSelectedHei}
          setItems={setHei}
          multiple={true}
        />
        {/* Amenities */}
        <Separator title="Amenities" />
        <View style={[styles.section, errors.amenities && styles.error]}>
          <View style={styles.checkboContainer}>
            {firstColumn.map(item => (
              <BouncyCheckbox
                disableBuiltInState
                key={item.name}
                isChecked={amenities[item.name]}
                text={item.label}
                onPress={() => handleAmenitiesToggle(item.name)}
                style={{paddingVertical: 2.5}}
                textStyle={[styles.label, {textDecorationLine: 'none'}]}
                fillColor={COLORS.teal}
                unfillColor={COLORS.white}
                iconStyle={{borderColor: COLORS.teal}}
              />
            ))}
          </View>
          <View style={styles.checkboContainer}>
            {secondColumn.map(item => (
              <BouncyCheckbox
                disableBuiltInState
                key={item.name}
                isChecked={amenities[item.name]}
                text={item.label}
                onPress={() => handleAmenitiesToggle(item.name)}
                style={{paddingVertical: 2.5}}
                textStyle={[styles.label, {textDecorationLine: 'none'}]}
                fillColor={COLORS.teal}
                unfillColor={COLORS.white}
                iconStyle={{borderColor: COLORS.teal}}
              />
            ))}
          </View>
        </View>
        {/* Establishment Rules */}
        <Separator title="Establishment Rules" />
        <View style={styles.section}>
          <BouncyCheckbox
            disableBuiltInState
            isChecked={rules.pets}
            onPress={() => handleRulesToggle('pets')}
            textStyle={[styles.label, {textDecorationLine: 'none'}]}
            fillColor={COLORS.teal}
            unfillColor={COLORS.white}
            iconStyle={{borderColor: COLORS.teal}}
            text="Pets"
          />
          <BouncyCheckbox
            disableBuiltInState
            isChecked={rules.visitors}
            onPress={() => handleRulesToggle('visitors')}
            textStyle={[styles.label, {textDecorationLine: 'none'}]}
            fillColor={COLORS.teal}
            unfillColor={COLORS.white}
            iconStyle={{borderColor: COLORS.teal}}
            text="Visitors"
          />
          <BouncyCheckbox
            disableBuiltInState
            isChecked={rules.curfew}
            onPress={() => handleRulesToggle('curfew')}
            textStyle={[styles.label, {textDecorationLine: 'none'}]}
            fillColor={COLORS.teal}
            unfillColor={COLORS.white}
            iconStyle={{borderColor: COLORS.teal}}
            text="Curfew"
          />
        </View>
        {/* Payment and Duration Terms */}
        <Separator title="Payment and Duration Terms (Optional)" />
        <View
          style={{
            backgroundColor: COLORS.teal,
            padding: 5,
            borderRadius: 5,
            marginTop: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="info" color={COLORS.white} size={16} />
            <Text
              style={[
                styles.label,
                {fontSize: 12, marginStart: 5, color: COLORS.white},
              ]}>
              Leave it blank if not applicable
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: COLORS.teal,
            padding: 5,
            borderRadius: 5,
            marginTop: 5,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon name="info" color={COLORS.white} size={16} />
            <Text
              style={[
                styles.label,
                {fontSize: 12, marginStart: 5, color: COLORS.white},
              ]}>
              Enter the duration in 'months' for the minimum stay.
            </Text>
          </View>
        </View>
        {/* Advance Deposit */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.advance_deposit}
              placeholder="Advance Deposit"
              placeholderTextColor={COLORS.grey}
              onChangeText={value =>
                handleTextInputChange('advance_deposit', value)
              }
              keyboardType="numeric"
            />
          </View>
          <View style={{width: 16}} />
          {/* Security Deposit */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.security_deposit}
              placeholder="Security Deposit"
              placeholderTextColor={COLORS.grey}
              onChangeText={value =>
                handleTextInputChange('security_deposit', value)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={[styles.section, {alignItems: 'center'}]}>
          {/* Minimum Stay */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.minimum_stay}
              placeholder="Minimum Stay"
              placeholderTextColor={COLORS.grey}
              onChangeText={value =>
                handleTextInputChange('minimum_stay', value)
              }
              keyboardType="numeric"
            />
          </View>
        </View>
        <View style={{marginTop: 16}}>
          <TouchableOpacity
            style={styles.button}
            onPress={editmode ? _updateListing : _createListing}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={'small'} color={COLORS.white} />
            ) : (
              <Text style={[styles.label, {color: COLORS.white}]}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

export default ListingForm;

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.grey,
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
    borderRadius: 5,
  },
  flatList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: 180,
  },
  emptyContainer: {
    width: width - 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    color: COLORS.grey,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 5,
    elevation: 4,
  },
  card: {
    flex: 1,
    width: width * 0.5,
    backgroundColor: COLORS.grey,
    borderRadius: 3,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
    height: '100%',
    width: '100%',
  },
  label: {
    fontFamily: 'Poppins-Regular',
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
    backgroundColor: COLORS.white,
    elevation: 2,
    fontFamily: 'Poppins-Regular',
  },
  error: {
    borderColor: 'red',
    borderWidth: 1,
  },
  dropdown: {
    borderWidth: 0,
    elevation: 2,
    borderRadius: 5,
  },
  checkboContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    marginVertical: 4,
    borderRadius: 5,
    elevation: 4,
    padding: 11,
  },
});

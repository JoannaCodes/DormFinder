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
import {BASE_URL} from '../../constants';
import {HEI, AMENITIES} from '../../constants/values';
import {launchImageLibrary} from 'react-native-image-picker';
import axios from 'axios';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import React, {useState, useEffect, useCallback} from 'react';
import Toast from 'react-native-toast-message';

const Separator = ({title}) => {
  return (
    <View style={styles.separator}>
      <View style={styles.line} />
      <Text style={{marginHorizontal: 5}}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
};

const ListingForm = ({route, navigation}) => {
  const {dormref, userref, editmode} = route.params;

  const [heiOpen, setHeiOpen] = useState(false);
  const [amenititesOpen, setAmenitiesOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [hei, setHei] = useState(HEI);
  const [amenities, setAmenities] = useState(AMENITIES);

  const [images, setImages] = useState('');
  const [selectedHei, setSelectedHei] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [initialValues, setInitialValues] = useState({
    address: '',
    advance_deposit: '',
    desc: '',
    minimum_stay: '',
    name: '',
    price: '',
    security_deposit: '',
    slots: '',
    utilities: '',
  });
  const [checkboxes, setCheckboxes] = React.useState({
    pets: false,
    visitors: false,
    curfew: false,
  });

  const [errors, setErrors] = useState({
    name: false,
    price: false,
    slots: false,
    desc: false,
    images: false,
    hei: false,
    amenities: false,
  });

  useEffect(() => {
    if (editmode) {
      fetchDormDetails();
    }
  }, [dormref]);

  const fetchDormDetails = async () => {
    await axios
      .get(`${BASE_URL}?tag=get_dorm_details&dormref=${dormref}`)
      .then(response => {
        var output = JSON.parse(response.data);
        const fetchedHei = output.hei.split(',');
        const fetchedAmenities = output.amenities.split(',');

        // Set initial values
        setInitialValues(prevState => ({
          ...prevState,
          address: output.address,
          advance_deposit: output.advance_deposit,
          desc: output.desc,
          minimum_stay: output.minimum_stay,
          name: output.name,
          price: output.price,
          security_deposit: output.security_deposit,
          slots: output.slots.toString(),
          utilities: output.utilities,
        }));

        // Set selected HEI
        setSelectedHei(fetchedHei);

        // Set selected amenities
        setSelectedAmenities(fetchedAmenities);

        // Set checkboxes
        setCheckboxes({
          pets: Boolean(output.pets),
          visitors: Boolean(output.visitors),
          curfew: Boolean(output.curfew),
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  async function _createListing() {
    setIsLoading(true);
    const formData = new FormData();

    if (validateInputs()) {
      formData.append('tag', 'insert_dorm');

      formData.append('userref', userref);
      for (const key in initialValues) {
        formData.append(key, initialValues[key]);
      }

      images.map((image, index) => {
        formData.append(`image_${index}`, {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      });

      // Append selected HEI
      formData.append('hei', selectedHei.join(','));

      // Append selected amenities
      formData.append('amenities', selectedAmenities.join(','));

      // Append checkboxes
      for (const key in checkboxes) {
        formData.append(key, checkboxes[key]);
      }

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
          navigation.navigate('Dorm Listing');
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Dorm Finder',
            text2: 'An error occured. Please Try Again',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    console.log(formData);
  }

  async function _updateListing() {
    // setIsLoading(true);
    const formData = new FormData();

    if (validateInputs()) {
      formData.append('tag', 'update_dorm');

      formData.append('userref', userref);
      for (const key in initialValues) {
        formData.append(key, initialValues[key]);
      }

      images.map((image, index) => {
        formData.append(`image_${index}`, {
          uri: image.uri,
          type: image.type,
          name: image.fileName,
        });
      });

      // Append selected HEI
      formData.append('hei', selectedHei.join(','));

      // Append selected amenities
      formData.append('amenities', selectedAmenities.join(','));

      // Append checkboxes
      for (const key in checkboxes) {
        formData.append(key, checkboxes[key]);
      }

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
          navigation.navigate('Dorm Listing');
        })
        .catch(error => {
          Toast.show({
            type: 'error',
            text1: 'Dorm Finder',
            text2: 'An error occured. Please Try Again',
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    console.log(formData);
  }

  const validateInputs = () => {
    const requiredFields = ['name', 'price', 'slots', 'address', 'desc'];
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

    if (images.length === 0) {
      newErrors.images = true;
      isValid = false;
    } else {
      newErrors.images = false;
    }

    if (selectedHei.length === 0) {
      newErrors.hei = true;
      isValid = false;
    } else {
      newErrors.hei = false;
    }

    if (selectedAmenities.length === 0) {
      newErrors.amenities = true;
      isValid = false;
    } else {
      newErrors.amenities = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Toast.show({
        type: 'error',
        text1: 'Dorm Finder',
        text2: 'Validation Error. Please fill in all the required fields',
      });
    } else {
    }

    return isValid;
  };

  const handleCheckboxToggle = name => {
    setCheckboxes(prevState => ({
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
          const assets = response.assets;
          setImages(assets);
        }
      },
    );
  };

  const onHeiOpen = useCallback(() => {
    setAmenitiesOpen(false);
  }, []);

  const onAmenitiesOpen = useCallback(() => {
    setHeiOpen(false);
  }, []);

  const removeItem = id => {
    let arr = images.filter(function (item) {
      return item.fileName !== id;
    });
    setImages(arr);
    LayoutAnimation.configureNext(layoutAnimConfig);
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() => removeItem(item.fileName)}>
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
            <Icon name="image" size={30} color={'#CCCCCC'} />
            <Text style={styles.emptyTitle}>
              Upload images again. Previous dorm images will be overwritten
            </Text>
            <Text style={{color: '#CCCCCC'}}>Tap the image to remove it</Text>
          </>
        ) : (
          <>
            <Icon name="image" size={30} color={'#CCCCCC'} />
            <Text style={styles.emptyTitle}>Upload dorm images</Text>
            <Text style={{color: '#CCCCCC'}}>Tap the image to remove it</Text>
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
            <Text style={{color: '#FFFFFF'}}>Upload Images</Text>
          </TouchableOpacity>
        </View>
        {/*  */}
        <Separator title="Basic Information" />
        {/* Name */}
        <TextInput
          style={[styles.input, errors.name && styles.error]}
          value={initialValues.name}
          placeholder="Establishment Name"
          placeholderTextColor="#CCCCCC"
          onChangeText={value => handleTextInputChange('name', value)}
        />
        <View style={styles.section}>
          {/* Price */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, errors.price && styles.error]}
              value={initialValues.price}
              placeholder="Price"
              placeholderTextColor="#CCCCCC"
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
              placeholderTextColor="#CCCCCC"
              keyboardType="numeric"
              onChangeText={value => handleTextInputChange('slots', value)}
            />
          </View>
        </View>
        {/* Address */}
        <TextInput
          style={[styles.input, errors.address && styles.error]}
          value={initialValues.address}
          placeholder="Address"
          placeholderTextColor="#CCCCCC"
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
          placeholderTextColor="#CCCCCC"
          height={150}
          textAlignVertical="top"
          multiline
          onChangeText={value => handleTextInputChange('desc', value)}
        />
        {/* HEIs */}
        <DropDownPicker
          mode="BADGE"
          listMode="SCROLLVIEW"
          placeholder="Select Nearby HEIs"
          placeholderStyle={{color: '#CCCCCC'}}
          zIndex={3000}
          zIndexInverse={1000}
          badgeColors={['#0E898B']}
          badgeDotColors={['white']}
          badgeTextStyle={{color: 'white'}}
          style={[styles.dropdown, errors.hei && styles.error]}
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
        {/* Amenities */}
        <Separator title="Amenities" />
        <DropDownPicker
          mode="BADGE"
          listMode="SCROLLVIEW"
          dropDownDirection="BOTTOM"
          placeholder="Select Amenities"
          placeholderStyle={{color: '#CCCCCC'}}
          zIndex={2000}
          zIndexInverse={2000}
          badgeColors={['#0E898B']}
          badgeDotColors={['white']}
          badgeTextStyle={{color: 'white'}}
          style={[styles.dropdown, errors.amenities && styles.error]}
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
        {/* Establishment Rules */}
        <Separator title="Establishment Rules (Optional)" />
        <View style={styles.section}>
          <BouncyCheckbox
            disableBuiltInState
            isChecked={checkboxes.pets}
            onPress={() => handleCheckboxToggle('pets')}
            textStyle={{textDecorationLine: 'none'}}
            fillColor="#0E898B"
            unfillColor="#FFFFFF"
            iconStyle={{borderColor: '#0E898B'}}
            text="Pets"
          />
          <BouncyCheckbox
            disableBuiltInState
            isChecked={checkboxes.visitors}
            onPress={() => handleCheckboxToggle('visitors')}
            textStyle={{textDecorationLine: 'none'}}
            fillColor="#0E898B"
            unfillColor="#FFFFFF"
            iconStyle={{borderColor: '#0E898B'}}
            text="Visitors"
          />
          <BouncyCheckbox
            disableBuiltInState
            isChecked={checkboxes.curfew}
            onPress={() => handleCheckboxToggle('curfew')}
            textStyle={{textDecorationLine: 'none'}}
            fillColor="#0E898B"
            unfillColor="#FFFFFF"
            iconStyle={{borderColor: '#0E898B'}}
            text="Curfew"
          />
        </View>
        {/* Payment and Duration Terms */}
        <Separator title="Payment and Duration Terms (Optional)" />
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="info" color={'#0E898B'} size={16} />
          <Text style={{fontSize: 12}}>'N/A' if not applicable</Text>
        </View>
        {/* Advance Deposit */}
        <View style={styles.section}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.advance_deposit}
              placeholder="Advance Deposit"
              placeholderTextColor="#CCCCCC"
              onChangeText={value =>
                handleTextInputChange('advance_deposit', value)
              }
            />
          </View>
          <View style={{width: 16}} />
          {/* Security Deposit */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.security_deposit}
              placeholder="Security Deposit"
              placeholderTextColor="#CCCCCC"
              onChangeText={value =>
                handleTextInputChange('security_deposit', value)
              }
            />
          </View>
        </View>
        <View style={styles.section}>
          {/* Utility Exclusivity */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.utilities}
              placeholder="Utility Exclusivity"
              placeholderTextColor="#CCCCCC"
              onChangeText={() => handleTextInputChange('utilities')}
            />
          </View>
          <View style={{width: 16}} />
          {/* Minimum Stay */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={initialValues.minimum_stay}
              placeholder="Minimum Stay"
              placeholderTextColor="#CCCCCC"
              onChangeText={() => handleTextInputChange('minimum_stay')}
            />
          </View>
        </View>
        <View style={{marginTop: 16}}>
          <TouchableOpacity
            style={styles.button}
            onPress={editmode ? _updateListing : _createListing}
            disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size={'small'} color={'#FFFFFF'} />
            ) : (
              <Text style={{color: '#FFFFFF'}}>Submit</Text>
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
    fontWeight: 'bold',
    color: '#CCCCCC',
    textAlign: 'center',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 4,
  },
  card: {
    flex: 1,
    width: width * 0.5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
    backgroundColor: '#CCCCCC',
    height: '100%',
    width: '100%',
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
  error: {
    borderColor: 'red',
    borderWidth: 1,
  },
  dropdown: {
    borderWidth: 0,
    elevation: 2,
    borderRadius: 5,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#0E898B',
    marginVertical: 4,
    borderRadius: 5,
    elevation: 4,
    padding: 11,
  },
});

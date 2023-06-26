/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
} from 'react-native';
import {BASE_URL, DORM_UPLOADS, AUTH_KEY, API_URL} from '../../../constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';

import ViewReviews from '../ViewReviews';
import VerifiyPromtpModal from '../modals/VerifiyPromtpModal';
import COLORS from '../../../constants/colors';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const DormListing = ({route, navigation}) => {
  const {user, verified} = route.params;
  let URL = BASE_URL;

  const [isLoading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [promptModalVisible, setPromptModalVisible] = useState(false);

  const [selectedDorm, setSelectedDorm] = useState('');
  const [status, setStatus] = useState('success');
  const [disable, setDisable] = useState(false);
  const [dorms, setDorms] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showMenuID, setShowMenuID] = useState(null);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();

      return () => {
        // Clean up any resources if needed
      };
    }, []),
  );

  const fetchData = async () => {
    setLoading(true);
    await axios
      .get(`${URL}?tag=get_dorms&userref=${user}`, {
        headers: {
          'Auth-Key': AUTH_KEY,
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(response => {
        const data = JSON.parse(response.data);
        setDorms(data);

        // Exclude image URLs from the data
        const dataWithoutImages = data.map(item => {
          const {images, ...rest} = item;
          return rest;
        });

        AsyncStorage.setItem('dormListing', JSON.stringify(dataWithoutImages));
      })
      .catch(async error => {
        console.error('Error occurred during the Axios request:', error);
        const storedDorms = await AsyncStorage.getItem('dormListing');
        if (storedDorms) {
          setDorms(JSON.parse(storedDorms));
          setDisable(true);
        } else {
          setStatus('failed');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const _deleteDorm = dormref => {
    Alert.alert(
      'Dorm Finder',
      'Are you sure you want to delete this dorm listing? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'delete',
          onPress: async () => {
            const formData = new FormData();
            formData.append('tag', 'delete_dorm');
            formData.append('userref', user);
            formData.append('dormref', dormref);

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
                    text2: 'Dorm listing deleted',
                  });

                  setLoading(true);
                  fetchData();
                } else if (message === 'failed') {
                  Toast.show({
                    type: 'success',
                    text1: 'StudyHive',
                    text2: 'Unable to delete listing. Please try again.',
                  });
                  fetchData();
                }
              });
          },
        },
      ],
    );
  };

  const handleHideOption = dormref => {
    Alert.alert(
      'Dorm Finder',
      'Are you sure you want to hide this dorm listing? This action cannot be undone.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          style: 'default',
          onPress: async () => {
            const formData = new FormData();
            formData.append('action', 'addRemoveHide');
            formData.append('user_id', user);
            formData.append('dormref', dormref);

            const response = await fetch(API_URL, {
              method: 'POST',
              headers: {
                'Auth-Key': AUTH_KEY,
              },
              body: formData,
            });

            const json = await response.json();
            if(json.code == 200) {
              Toast.show({
                type: 'success',
                text1: 'StudyHive',
                text2: 'Successfully!',
              });
              setShowMenu(false);
              setLoading(true);
              fetchData();
            } else {
              Toast.show({
                type: 'success',
                text1: 'StudyHive',
                text2: 'Unable to hide listing. Please try again.',
              });
              setShowMenu(false);
              fetchData();
            }
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const images = item.images ? item.images.split(',') : [];
    
    const handleEditOption = (dormref) => {
      navigation.navigate('Listing Form', {
        dormref: dormref,
        userref: user,
        editmode: true,
      });
      setShowMenu(false);
    };

    const handleSeeReviewsOption = () => {
      setReviewModalVisible(true);
      setSelectedDorm(item.id);
      setShowMenu(false);
    };

    const handleDeleteOption = () => {
      _deleteDorm(item.id);
      setShowMenu(false);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.5}
        underlayColor={COLORS.grey}
        onPress={() =>
          navigation.navigate('Dorm Details', {
            dormref: item.id,
            userref: user,
          })
        }
        style={styles.card}>
        <Image
          source={{
            uri: `${DORM_UPLOADS}/${item.id}/${images[0]}`,
          }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            setShowMenu(true);
            setShowMenuID(item.id);
          }}>
          <Icon name="more-vert" size={18} color={COLORS.dark} />
        </TouchableOpacity>
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Modal
            visible={showMenu == true && showMenuID == item.id}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setShowMenu(false)}>
            <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
              <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <View style={styles.menuContainer}>
                <TouchableOpacity
                  style={[styles.menuItem, disable && styles.failedButton]}
                  disabled={disable}
                  onPress={() => {
                    // Handle edit option
                    handleEditOption(item.id);
                  }}>
                  <Text style={styles.menuItemText}>Edit</Text>
                </TouchableOpacity>
                <Separator />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    // Handle see reviews option
                    handleSeeReviewsOption();
                  }}>
                  <Text style={styles.menuItemText}>See Reviews</Text>
                </TouchableOpacity>
                <Separator />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    // Handle hide option
                    handleHideOption(item.id);
                  }}>
                  <Text style={styles.menuItemText}>
                    {item.hide == 0 ? 'Hide' : 'Show'}
                  </Text>
                </TouchableOpacity>
                <Separator />
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    // Handle delete option
                    handleDeleteOption();
                  }}>
                  <Text style={styles.menuItemText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'failed' ? (
          <>
            <Image
              source={require('../../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>
              Cannot retrieve dorm listing at this time.
            </Text>
            <Text style={styles.message}>Please try again later.</Text>
            <TouchableOpacity
              style={[
                styles.btnContainer,
                {alignItems: 'center', marginTop: 20, width: '100%'},
              ]}
              onPress={() => {
                setLoading(true);
                fetchData();
              }}>
              <Text>Retry</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Image
              source={require('../../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>No Dorm Listing</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.message}>Tap "</Text>
              <Icon name="add" size={18} color={COLORS.teal} />
              <Text style={styles.message}>" to Add Your Dorm</Text>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.teal} />
        </View>
      ) : (
        <>
          <FlatList
            contentContainerStyle={styles.cardContainer}
            data={dorms}
            horizontal={false}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmpty}
            numColumns={2}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
            }
          />
          <TouchableOpacity
            disabled={disable}
            style={[styles.button, disable && styles.failedButton]}
            onPress={() => {
              verified
                ? navigation.navigate('Listing Form', {
                    userref: user,
                    editmode: false,
                  })
                : setPromptModalVisible(true);
            }}>
            <Icon name="add" size={30} color={COLORS.white} />
          </TouchableOpacity>
        </>
      )}
      <ViewReviews
        visible={reviewModalVisible}
        onClose={() => setReviewModalVisible(false)}
        dormref={selectedDorm}
      />
      <VerifiyPromtpModal
        visible={promptModalVisible}
        onClose={() => setPromptModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default DormListing;
let width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    backgroundColor: COLORS.white,
  },
  overlay: {
    flex: 1,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
    marginTop: -30,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  btnContainer: {
    elevation: 2,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.teal,
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: COLORS.teal,
    borderRadius: 30,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  cardContainer: {
    flexGrow: 1,
  },
  card: {
    margin: 8,
    width: width / 2 - 24,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    backgroundColor: COLORS.grey,
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 5,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
  },
  failedButton: {
    opacity: 0.5,
  },
  menuButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: COLORS.white,
    borderRadius: 100,
    elevation: 4,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    padding: 16,
  },
  menuContainer: {
    width: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 10,
    elevation: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  menuItemText: {
    fontSize: 16,
  },
});

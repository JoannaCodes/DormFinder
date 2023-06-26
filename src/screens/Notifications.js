/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  AsyncStorage,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';
import {BASE_URL, AUTH_KEY} from '../../constants';
import COLORS from '../../constants/colors';

export default function Notifications({route, navigation}) {
  const {user} = route.params;
  const [notifContainer, setNotifContainer] = useState('');
  const [status, setStatus] = useState('success');
  const [isLoading, setLoading] = useState(true);
  // const [longContainer, setLongContainer] = useState('');
  // const [downloadedID, setDownloadedID] = useState('');

  // const [todayState, setTodayState] = useState('none');
  // const [recentState, setRecentState] = useState('none');
  // const [longState, setLongState] = useState('none');

  // const [showMoreLabel, setShowMoreLabel] = useState('Show More');
  // const [showMoreState, setShowMoreState] = useState(false);
  // const [colorLabel, setColorLabel] = useState('#7B9A35');

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
    try {
      let URL = BASE_URL;

      axios
        .get(URL + '?tag=getnotificationspast' + '&userref=' + user, {
          headers: {
            'Auth-Key': AUTH_KEY,
          },
        })
        .then(res => {
          var output = JSON.parse(res.data);
          setNotifContainer(output);
          AsyncStorage.setItem('notifications', JSON.stringify(output));
        });
    } catch (error) {
      console.error('Error occurred during the Axios request:', error);
      const storedNotifs = await AsyncStorage.getItem('notifications');
      if (storedNotifs) {
        setNotifContainer(JSON.parse(storedNotifs));
      } else {
        setStatus('failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderTodayNotif = itm => {
    return (
      <View style={styles.notifsContainer}>
        <View style={styles.notifItem}>
          <View style={styles.notifDate}>
            <Text style={styles.notifTextDate}>{itm.formatted_date}</Text>
          </View>
          <View style={styles.notifTitle}>
            <Text style={styles.notifText}>{itm.title}</Text>
          </View>
        </View>
        <Text style={styles.notifText}>{itm.ndesc}</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'failed' ? (
          <>
            <Image
              source={require('../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>
              Cannot retrieve notifcations at this time.
            </Text>
            <Text style={styles.message}>Please try again.</Text>
            <TouchableOpacity
              style={[styles.btnContainer, {marginTop: 20, width: '100%'}]}
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
              source={require('../../assets/empty_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.title}>No Notifications</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.teal} />
        </View>
      ) : (
        <View style={{marginBottom: 20}}>
          <Text style={styles.label}>STARTING TODAY</Text>
          <View style={styles.notifWrapper}>
            <FlatList
              data={notifContainer}
              renderItem={({item}) => renderTodayNotif(item)}
              ListEmptyComponent={renderEmpty}
              numColumns={1}
              initialNumToRender={100}
              keyExtractor={(item, index) => String(index)}
              refreshControl={
                <RefreshControl
                  //refresh control used for the Pull to Refresh
                  refreshing={isLoading}
                  onRefresh={fetchData}
                />
              }
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 10,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: COLORS.white,
  },
  notifWrapper: {
    width: 'auto',
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.white,
    flexDirection: 'column',
  },
  label: {
    fontSize: 15,
    color: COLORS.gray,
    fontFamily: 'Poppins-Regular',
  },
  notifsContainer: {
    padding: 10,
    marginTop: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#bdc3c7',
  },
  notifItem: {
    borderBottomColor: '#bdc3c7',
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  notifDate: {
    width: '70%',
    backgroundColor: 'transparent',
    alignItems: 'flex-start',
  },
  notifTitle: {
    width: '30%',
    backgroundColor: 'transparent',
    alignSelf: 'center',
    alignItems: 'flex-end',
  },
  notifTextDate: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  notifText: {
    fontSize: 13,
    fontFamily: 'Poppins-Regular',
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginTop: -30,
    marginBottom: 10,
    fontFamily: 'Poppins-SemiBold',
  },
  message: {
    textAlign: 'center',
    fontSize: 20,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
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
});

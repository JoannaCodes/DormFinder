/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../../constants';
import axios from 'axios';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const Bookmarks = ({navigation}) => {
  let URL = BASE_URL;
  let uid = 'qzPHvK8kHTy3i';
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('Success');
  const [dorms, setDorms] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${URL}?tag=get_bookmarks&userref=${uid}`,
        );
        var output = JSON.parse(response.data);
        setDorms(output);
        setLoading(false);
      } catch (error) {
        setStatus('Failed');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({item}) => {
    const images = item.images.split(',');
    return (
      <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD">
        <View style={styles.card}>
          <Image
            source={{
              uri: `http://192.168.0.12/DormFinder-Admin/uploads/dormImages/${item.dormref}/${images[0]}`,
            }}
            style={styles.cardImage}
          />
          <View style={styles.cardBody}>
            <View style={styles.details}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardText}>{item.price}</Text>
              <Text>{item.rating}</Text>
            </View>
            <Separator />
            <View style={styles.action}>
              <TouchableOpacity style={styles.btnContainer}>
                <Text>📝</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContainer}>
                <Text>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContainer}>
                <Text>💲</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnContainer}>
                <Text>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'Failed' ? (
          <>
            <Image
              source={require('../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>Network Error</Text>
          </>
        ) : (
          <>
            <Image
              source={require('../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Bookmarks</Text>
            <Text>Tap "❤️" to add the dorm that interests you</Text>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#0E898B" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={{flexGrow: 1}}
          data={dorms}
          keyExtractor={item => item.id}
          ListEmptyComponent={renderEmpty}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default Bookmarks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
    fontSize: 16,
  },
  emptyContainer: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  btnContainer: {
    elevation: 2,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0E898B',
    padding: 10,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#FFFFFF',
    margin: 8,
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  cardImage: {
    flex: 2,
    height: 150,
    resizeMode: 'cover',
  },
  cardBody: {
    flex: 3,
  },
  details: {
    flex: 4,
    justifyContent: 'space-evenly',
    padding: 8,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardText: {
    fontWeight: 'bold',
  },
});

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {BASE_URL} from '../../../constants';
import axios from 'axios';

const Separator = () => {
  return <View height={1} width={'100%'} backgroundColor={'#CCCCCC'} />;
};

const DormListing = ({navigation}) => {
  let URL = BASE_URL;
  let uid = 'LhVQ3FMv6d6lW';
  const [isLoading, setLoading] = useState(true);
  const [status, setStatus] = useState('Success');
  const [dorms, setDorms] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${URL}?tag=get_dorms&userref=${uid}`);
        var output = JSON.parse(response.data);
        setDorms(output);
        setLoading(false);
      } catch (error) {
        setStatus('Failed');
        setLoading(false);
      }
    };

    fetchData();
  }, [dorms, uid]);

  const renderItem = ({item}) => {
    const images = item.images.split(',');
    return (
      <View style={styles.card}>
        <Image
          source={{
            uri: `http://192.168.0.12/DormFinder-Admin/uploads/dormImages/${item.id}/${images[0]}`,
          }}
          style={styles.image}
        />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Separator />
          <View style={styles.action}>
            <TouchableOpacity style={styles.btnContainer}>
              <Text>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContainer}>
              <Text>🗑️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnContainer}>
              <Text>📊</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.emptyContainer}>
        {status === 'Failed' ? (
          <>
            <Image
              source={require('../../../assets/error_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>Network Error</Text>
          </>
        ) : (
          <>
            <Image
              source={require('../../../assets/house_upsketch.png')}
              style={{height: 360, width: 360}}
              resizeMode="cover"
            />
            <Text style={styles.emptyTitle}>No Dorm Listing</Text>
            <Text>Tap ➕ to Add Your Dorm</Text>
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
        <>
          <FlatList
            contentContainerStyle={{flexGrow: 1}}
            data={dorms}
            horizontal={false}
            keyExtractor={item => item.id}
            ListEmptyComponent={renderEmpty}
            numColumns={2}
            renderItem={renderItem}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('Dorm Listing Form', {
                userref: uid,
                editmode: false,
              })
            }>
            <Text style={styles.buttonText}>➕</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default DormListing;
let width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFFFFF',
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
  button: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#0E898B',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    margin: 8,
    width: width / 2 - 24,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
});

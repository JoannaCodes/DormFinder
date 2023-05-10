/* eslint-disable react-native/no-inline-styles */
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
  Alert,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {BASE_URL} from '../../../constants';
import axios from 'axios';

const DormListing = ({navigation}) => {
  const [dorms, setDorms] = useState('');
  let uid = 'LhVQ3FMv6d6lW';

  useEffect(() => {
    try {
      let URL = BASE_URL;

      axios
        .get(`${URL}?tag=get_dorms&userref=${uid}`)
        .then(response => {
          var output = JSON.parse(response.data);
          setDorms(output);
        })
        .catch(err => {
          console.error(err);
        });
    } catch (err) {
      console.error(err);
    }
  }, [uid]);

  const renderItem = ({item}) => {
    const images = item.images.split(',');
    return (
      <View style={styles.card}>
        <Image source={{uri: images[0]}} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={styles.action}>
            <Button
              title="✏️"
              color="#0E898B"
              onPress={() => {
                navigation.navigate('Create Dorm Listing', {
                  dormref: item.id,
                  userref: item.userref,
                  editmode: true,
                });
              }}
            />
            <Button
              title="📊"
              color="#0E898B"
              onPress={() => {
                Alert.alert('Message', item.id);
              }}
            />
            <Button
              title="🗑️"
              color="#0E898B"
              onPress={() => {
                Alert.alert('Message', item.id);
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 32, fontWeight: 'bold'}}>No Dorm Listing</Text>
        <Text>Tap "+ Create Listing" to Add Your Dorm</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={dorms}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal={false}
        numColumns={2}
        ListEmptyComponent={renderEmpty}
      />
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate('Create Dorm Listing', {
            userref: uid,
            editmode: false,
          })
        }>
        <Text style={styles.buttonText}>+ Create Listing</Text>
      </TouchableOpacity>
    </View>
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
  },
  button: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#0E898B',
    borderRadius: 30,
    padding: 15,
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
  info: {
    padding: 10, // Add some padding
  },
  name: {
    fontSize: 18, // Set font size
    fontWeight: 'bold', // Set font weight
    marginBottom: 5, // Add some margin bottom
  },
  action: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
});

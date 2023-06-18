import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';

import {
  Container,
  Card,
  UserInfo,
  UserImgWrapper,
  UserImg,
  UserInfoText,
  UserName,
  PostTime,
  MessageText,
  TextSection,
} from '../components/styles/MessageStyles';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL, AUTH_KEY } from '../../constants/index';
import moment from 'moment';

/*const Messages = [
  {
    id: '1',
    userName: 'Jenny Doe',
    userImg: require('../../assets/img/cat.jpg'),
    messageTime: '4 mins ago',
    messageText: 'PRACTICE LANGGGG',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../../assets/img/cow.jpg'),
    messageTime: '2 hours ago',
    messageText: 'PRACTICE LANGGGG',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../../assets/img/horse.jpg'),
    messageTime: '1 hours ago',
    messageText: 'PRACTICE LANGGGG',
  },
];*/

const Inbox = ({ navigation }) => {
  
  const [myInfo, setMyInfo] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const fetchData = async () => {
    const data = await AsyncStorage.getItem('user');
    const convertData = JSON.parse(data);
    setUser(convertData)

    let formdata = new FormData();
    formdata.append('action', 'getChatrooms');
    formdata.append('myid', convertData.id);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Auth-Key': AUTH_KEY,
      },
      body: formdata
    });
    
    const json = await response.json();
    if(json.code == 200) {
      setChatRooms(json.data);
      setMyInfo(convertData);
    }
  };

  const [user, setUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showFlatList, setShowFlatList] = useState(true);

  useEffect(() => {
    let isMounted = true
    const intervalId = setInterval(() => fetchData(), 3000);

    return () => {
      clearInterval(intervalId);
      isMounted = false
    }
  }, [useState])

  const handleSearch = (text) => {
    fetchData();

    setSearchQuery(text);
    const filtered = chatRooms.filter((data) =>
      data.username.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredMessages(filtered);
    setShowFlatList(text === '' ? true : filtered.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredMessages(Messages);
    setShowFlatList(true);
  };

  return (
    <Container>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
            <Image style={styles.clearIcon} source={require('../../assets/img/ic_clear.png')} />
          </TouchableOpacity>
        ) : (
          <View style={styles.clearButton} />
        )}
        <Image source={require('../../assets/img/ic_search.png')} style={styles.searchIcon} />
      </View>
      {showFlatList && chatRooms.length != 0 ? (
        
        <FlatList
          data={searchQuery ? filteredMessages : chatRooms}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <Card onPress={() => 
              navigation.navigate('Chat Room', { 
                navigation: navigation,
                anotherImageUrl: item.imageUrl,
                username: item.username,
                unique_code: item.unique_code,
                myid: myInfo.id,myusername: myInfo.username,
                anotherid: item?.user_id,
                user: user
              })
            }>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={{uri: item.imageUrl}} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.username}</UserName>
                    <PostTime>{item.time != 0 ? moment.unix(item.time).utcOffset('+0800').format("hh:mm A") : "NEW"}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.message}</MessageText>
                </TextSection>
              </UserInfo>
            </Card>
          )}
        />
      ) : (
        <Text>No results found</Text>
      )}
    </Container>
  );
};

export default Inbox;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#ededed',
    paddingHorizontal: 40, // Adjust this value based on the icon's width
    borderRadius: 10,
  },
  searchIcon: {
    position: 'absolute',
    top: 12, // Adjust this value to vertically center the icon
    left: 10, // Adjust this value to set the left offset of the icon
    height: 18,
    width: 18,
  },
  clearButton: {
    position: 'absolute',
    top: 12, // Adjust this value to vertically center the icon
    right: 10, // Adjust this value to set the right offset of the icon
    height: 18,
    width: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearIcon: {
    height: 15,
    width: 15,
  },
});

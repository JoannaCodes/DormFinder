/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';

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
import {API_URL, AUTH_KEY} from '../../constants/index';
import COLORS from '../../constants/colors';
import moment from 'moment';

const Inbox = ({navigation}) => {
  const [myInfo, setMyInfo] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);
  const [status, setStatus] = useState('');
  const fetchData = async () => {
    const data = await AsyncStorage.getItem('user');
    const convertData = JSON.parse(data);
    setUser(convertData);

    let formdata = new FormData();
    formdata.append('action', 'getChatrooms');
    formdata.append('myid', convertData.id);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Auth-Key': AUTH_KEY,
      },
      body: formdata,
    });

    const json = await response.json();
    console.log(json);
    if (json.code === 200) {
      setChatRooms(json.data);
      setMyInfo(convertData);
    } else if (json.code !== 403) {
      setStatus('failed');
    }
  };

  const [user, setUser] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [showFlatList, setShowFlatList] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const intervalId = setInterval(() => fetchData(), 3000);

    return () => {
      clearInterval(intervalId);
      isMounted = false;
    };
  }, [useState]);

  const handleSearch = text => {
    fetchData();

    setSearchQuery(text);
    const filtered = chatRooms.filter(data =>
      data.username.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredMessages(filtered);
    setShowFlatList(text === '' ? true : filtered.length > 0);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setFilteredMessages([]);
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
          <TouchableOpacity
            onPress={handleClearSearch}
            style={styles.clearButton}>
            <Image
              style={styles.clearIcon}
              source={require('../../assets/img/ic_clear.png')}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.clearButton} />
        )}
        <Image
          source={require('../../assets/img/ic_search.png')}
          style={styles.searchIcon}
        />
      </View>
      {showFlatList && chatRooms.length !== 0 ? (
        <FlatList
          data={searchQuery ? filteredMessages : chatRooms}
          keyExtractor={item => item?.id}
          renderItem={({item}) => (
            item.message != '' ? (
              <Card
                onPress={() =>
                  navigation.navigate('Chat Room', {
                    navigation: navigation,
                    anotherImageUrl: item.imageUrl,
                    username: item.username,
                    unique_code: item.unique_code,
                    chatroom_code: item.chatroom_code,
                    myid: myInfo.id,
                    myusername: myInfo.username,
                    anotherid: item?.user_id,
                    user: user,
                    ownerid: item.ownerid,
                    pay_rent: item.pay_rent
                  })
                }>
                <UserInfo>
                  <UserImgWrapper>
                    <UserImg source={{uri: item.imageUrl}} />
                    <View style={{position:'absolute', bottom:14,right:0,width:15,height:15,borderRadius:100,backgroundColor:item.is_online == 0 ? 'gray' : 'green'}}></View>
                  </UserImgWrapper>
                  <TextSection >
                    <UserInfoText>
                      <UserName style={{ fontFamily: 'Poppins-Regular'}}>
                        {item.username}
                      </UserName>
                      <PostTime style={{ marginRight: 30, fontFamily: 'Poppins-Regular' }}>
                        {item.time !== 0
                          ? moment
                              .unix(item.time)
                              .utcOffset('+0800')
                              .format('hh:mm A')
                          : 'NEW'}
                      </PostTime>
                    </UserInfoText>
                    <MessageText style={{ fontFamily: 'Poppins-Regular'}}>
                      {item.message}
                    </MessageText>
                  </TextSection>
                </UserInfo>
              </Card>
            ) : null
          )}
        />
      ) : (
        <View>
          {status === 'failed' ? (
            <>
              <Image
                source={require('../../assets/error_upsketch.png')}
                style={{height: 360, width: 360}}
                resizeMode="cover"
              />
              <Text style={styles.title}>
                Cannot retrieve messages at this time.
              </Text>
              <Text style={styles.message}>Please try again.</Text>
              <TouchableOpacity
                style={[styles.btnContainer, {marginTop: 20}]}
                onPress={() => {
                  fetchData();
                }}>
                <Text>Retry</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Image
                source={require('../../assets/chatting_upsketch.png')}
                style={{height: 360, width: 360}}
                resizeMode="cover"
              />
              <Text style={styles.title}>Start Messaging</Text>
            </>
          )}
        </View>
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
    padding: 0, 
    flex: 1, fontFamily: 'Poppins-Regular',
    height: 40,
    backgroundColor: '#ededed',
    paddingHorizontal: 40, // Adjust this value based on the icon's width
    borderRadius: 10,
    marginLeft: 5
  },
  searchIcon: {
    position: 'absolute',
    top: 10, // Adjust this value to vertically center the icon
    left: 15, // Adjust this value to set the left offset of the icon
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
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // flexGrow: 1,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.teal,
    padding: 10,
  },
});

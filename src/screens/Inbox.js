import React, { useState } from 'react';
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

const Messages = [
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
];

const Inbox = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMessages, setFilteredMessages] = useState(Messages);
  const [showFlatList, setShowFlatList] = useState(true);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = Messages.filter((message) =>
      message.userName.toLowerCase().includes(text.toLowerCase())
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
      {showFlatList ? (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card onPress={() => navigation.navigate('Chat Room', { userName: item.userName })}>
              <UserInfo>
                <UserImgWrapper>
                  <UserImg source={item.userImg} />
                </UserImgWrapper>
                <TextSection>
                  <UserInfoText>
                    <UserName>{item.userName}</UserName>
                    <PostTime>{item.messageTime}</PostTime>
                  </UserInfoText>
                  <MessageText>{item.messageText}</MessageText>
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

import React from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
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
    messageText:
      'PRACTICE LANGGGG',
  },
  {
    id: '2',
    userName: 'John Doe',
    userImg: require('../../assets/img/cow.jpg'),
    messageTime: '2 hours ago',
    messageText:
      'PRACTICE LANGGGG',
  },
  {
    id: '3',
    userName: 'Ken William',
    userImg: require('../../assets/img/horse.jpg'),
    messageTime: '1 hours ago',
    messageText:
      'PRACTICE LANGGGG',
  },
];

const Inbox = ({navigation}) => {
    return (
      <Container>
        <FlatList 
          data={Messages}
          keyExtractor={item=>item.id}
          renderItem={({item}) => (
            <Card onPress={() => navigation.navigate('Chat Room', {userName: item.userName})}>
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
      </Container>
    );
};

export default Inbox;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
});
import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Bubble, GiftedChat, Send } from 'react-native-gifted-chat';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
      {
        _id: 2,
        text: 'Hello world',
        createdAt: new Date(),
        user: {
          _id: 1,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ]);
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View>
          <MaterialCommunityIcons
            name="send-circle"
            style={{ marginBottom: 5, marginRight: 5 }}
            size={32}
            color="teal"
          />
        </View>
      </Send>
    );
  };

  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: 'teal',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
        renderMessageImage={renderMessageImage}
      />
    );
  };

  const renderMessageImage = (props) => {
    const { currentMessage } = props;

    return (
      <TouchableOpacity onPress={() => handleImagePress(currentMessage)}>
        <Image
          source={{ uri: currentMessage.image }}
          style={styles.messageImage}
        />
      </TouchableOpacity>
    );
  };

  const handleImagePress = (message) => {
    Alert.alert('Image Pressed', `Image URI: ${message.image}`);
  };

  const scrollToBottomComponent = () => {
    return <Icon name="keyboard-double-arrow-down" size={22} color="teal" />;
  };

  const handleCameraButton = () => {
    const options = {
      title: 'Take a photo',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
    };

    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled taking a photo');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const { uri, type, fileName } = response;
        const source = {
          uri: uri,
          type: type,
          name: fileName,
        };

        const message = [
          {
            _id: new Date().getTime(),
            text: '',
            createdAt: new Date(),
            user: {
              _id: 1,
            },
            image: source.uri,
          },
        ];

        onSend(message);
      }
    });
  };

  const handleAttachmentButton = () => {
    const options = {
      title: 'Select Attachment',
      mediaType: 'photo',
      quality: 1,
      maxWidth: 500,
      maxHeight: 500,
    };

    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image selection');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const { uri, type, fileName } = response;
        const source = {
          uri: uri,
          type: type,
          name: fileName,
        };

        const message = [
          {
            _id: new Date().getTime(),
            text: '',
            createdAt: new Date(),
            user: {
              _id: 1,
            },
            image: source.uri,
          },
        ];

        onSend(message);
      }
    });
  };

  const renderActions = (props) => (
    <View style={styles.actionsContainer}>
      <TouchableOpacity onPress={handleCameraButton}>
        <MaterialCommunityIcons
          name="camera"
          size={24}
          color="gray"
          style={[styles.actionIcon, { paddingBottom: 10 }]}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAttachmentButton}>
        <MaterialCommunityIcons
          name="attachment"
          size={24}
          color="gray"
          style={[styles.actionIcon, { paddingBottom: 10 }]}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        renderBubble={renderBubble}
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderActions={renderActions}
      />
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  actionIcon: {
    marginHorizontal: 5,
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});

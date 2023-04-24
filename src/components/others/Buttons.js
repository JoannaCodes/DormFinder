/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

// buttonStyle for height, width, marginBottom
// textStyle for alignment

// buttonColor for PrimaryBtn - Colors: #0E898B(Default) or #FFFFFf
// textColor for PrimaryBtn and TertiaryBtn - Colors: #000000(Default) or #0E898B
// borderColor and textColor for GhostBtn - Colors: #0E898B(Default) or #FF0000

const PrimaryBtn = ({
  title,
  onPress,
  buttonColor,
  buttonStyle,
  textStyle,
  textColor,
}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor="transparent">
      <View
        style={[
          styles.container,
          buttonStyle,
          {
            backgroundColor: buttonColor || '#0E898B',
            borderRadius: 5,
            elevation: 4,
          },
        ]}>
        <Text
          style={[styles.title, textStyle, {color: textColor || '#000000'}]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const SecondaryBtn = ({title, onPress, buttonStyle, textStyle}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor="transparent">
      <View
        style={[
          styles.container,
          buttonStyle,
          {backgroundColor: '#D9D9D9', borderRadius: 5, elevation: 4},
        ]}>
        <Text style={[styles.title, textStyle, {color: '#000000'}]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

const TertiaryBtn = ({title, onPress, buttonStyle, textStyle, textColor}) => {
  return (
    <TouchableOpacity onPress={onPress} underlayColor="transparent">
      <View style={[styles.container, buttonStyle]}>
        <Text
          style={[styles.title, textStyle, {color: textColor || '#0E898B'}]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const GhostBtn = ({
  title,
  onPress,
  textStyle,
  textColor,
  buttonStyle,
  borderColor,
}) => {
  return (
    <TouchableHighlight onPress={onPress} underlayColor="transparent">
      <View
        style={[
          styles.container,
          buttonStyle,
          {
            borderColor: borderColor || '#0E898B',
            borderWidth: 1,
            borderRadius: 5,
          },
        ]}>
        <Text
          style={[styles.title, textStyle, {color: textColor || '#0E898B'}]}>
          {title}
        </Text>
      </View>
    </TouchableHighlight>
  );
};

export {PrimaryBtn, SecondaryBtn, TertiaryBtn, GhostBtn};

const styles = StyleSheet.create({
  container: {
    height: 60,
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontSize: 16,
  },
});

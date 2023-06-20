/* eslint-disable react-native/no-inline-styles */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Linking,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import Accordion from 'react-native-collapsible/Accordion';
import Icon from 'react-native-vector-icons/MaterialIcons';
import COLORS from '../../../constants/colors';
import {TENANTSECTIONS, OWNERSECTIONS} from '../../../constants/values';

const Help = () => {
  const [activeSections1, setActiveSections1] = useState([]);
  const [activeSections2, setActiveSections2] = useState([]);

  function renderHeader(section, _, isActive) {
    return (
      <View style={styles.accordHeader}>
        <Text style={styles.accordTitle}>{section.title}</Text>
        <Icon
          name={isActive ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={20}
          color="#bbb"
        />
      </View>
    );
  }

  function renderContent(section, _, isActive) {
    return (
      <View style={styles.accordBody}>
        <Text>{section.content}</Text>
      </View>
    );
  }

  const handleEmailPress = () => {
    Linking.openURL('mailto:info.studyhive@gmail.com');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={styles.label}>For Tenants</Text>
        <Accordion
          align="bottom"
          underlayColor={'none'}
          sections={TENANTSECTIONS}
          activeSections={activeSections1}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections1(sections)}
          sectionContainerStyle={styles.accordContainer}
        />
        <View style={{marginVertical: 10}} />
        <Text style={styles.label}>For Dorm Owners</Text>
        <Accordion
          align="bottom"
          underlayColor={'none'}
          sections={OWNERSECTIONS}
          activeSections={activeSections2}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections2(sections)}
          sectionContainerStyle={styles.accordContainer}
        />
        <View style={{marginVertical: 10}} />
        <View>
          <Text style={{textAlign: 'center'}}>
            For other concerns, kindly contact us at
          </Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text
              style={{
                marginStart: 5,
                textAlign: 'center',
                color: COLORS.blue,
                textDecorationLine: 'underline',
              }}>
              info.studyhive@gmail.com
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.white,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  accordContainer: {
    paddingBottom: 5,
  },
  accordHeader: {
    padding: 20,
    backgroundColor: COLORS.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  accordTitle: {
    fontSize: 16,
  },
  accordBody: {
    padding: 16,
  },
  textSmall: {
    fontSize: 16,
  },
});

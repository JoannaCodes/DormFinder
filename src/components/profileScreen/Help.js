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
import {GENERALGUIDESECTIONS, GENERALGUIDESECTIONS_FIL, TENANTSECTIONS, TENANTSECTIONS_FIL, OWNERSECTIONS, OWNERSECTIONS_FIL} from '../../../constants/values';

const Help = () => {
  const [activeSections1, setActiveSections1] = useState([]);
  const [activeSections2, setActiveSections2] = useState([]);
  const [isTranslated, setIsTranslated] = useState(false);

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
        <Text style={{ color: 'black', textAlign: 'justify' }}>{section.content}</Text>
      </View>
    );
  }

  const handleEmailPress = () => {
    Linking.openURL('mailto:info.studyhive@gmail.com');
  };

  const toggleTranslation = () => {
    setIsTranslated(prevState => !prevState);
  };



  const guideSections = isTranslated ? GENERALGUIDESECTIONS_FIL : GENERALGUIDESECTIONS;
  const tenantSections = isTranslated ? TENANTSECTIONS_FIL : TENANTSECTIONS;
  const ownerSections = isTranslated ? OWNERSECTIONS_FIL : OWNERSECTIONS;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <Text style={[styles.label1, { color: 'teal' }]}>How can we help?</Text>

      {/* BUTTON */}
        <TouchableOpacity onPress={toggleTranslation} style={styles.translateButton}>
          <Text style={styles.translateButtonText}>
            {isTranslated ? 'Switch to English' : 'Translate to Filipino'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>General Guide</Text>
        <Accordion
          align="bottom"
          underlayColor={'none'}
          sections={guideSections}
          activeSections={activeSections1}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections1(sections)}
          sectionContainerStyle={styles.accordContainer}
        />
        <View style={{ marginVertical: 10 }} />
        <Text style={styles.label}>For Tenants</Text>
        <Accordion
          align="bottom"
          underlayColor={'none'}
          sections={tenantSections}
          activeSections={activeSections1}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections1(sections)}
          sectionContainerStyle={styles.accordContainer}
        />
        <View style={{ marginVertical: 10 }} />
        <Text style={styles.label}>For Dorm Owners</Text>
        <Accordion
          align="bottom"
          underlayColor={'none'}
          sections={ownerSections}
          activeSections={activeSections2}
          renderHeader={renderHeader}
          renderContent={renderContent}
          onChange={sections => setActiveSections2(sections)}
          sectionContainerStyle={styles.accordContainer}
        />
        <View style={{ marginVertical: 5 }} />
        <View>
          <Text style={{ textAlign: 'center',  fontFamily: 'Poppins-Regular' }}>
            For other concerns, kindly contact us at
          </Text>
          <TouchableOpacity onPress={handleEmailPress}>
            <Text
              style={{
                fontFamily: 'Poppins-Regular',
                marginStart: 5,
                textAlign: 'center',
                color: 'teal',
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
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 7,
    color: 'black',
    fontSize: 15,
    },
  label1: {
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 15,
    fontSize: 23,
    color: 'teal',
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
    color: 'black',
  },
  accordBody: {
    padding: 16,
  },
  textSmall: {
    fontSize: 16,
  },
  translateButton: {
    backgroundColor: '#008080',
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 14,
    paddingRight: 20,
    paddingLeft: 20,
    marginTop: -10
  },
  translateButtonText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
  },
});

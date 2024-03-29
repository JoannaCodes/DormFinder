/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {BASE_URL, AUTH_KEY} from '../../../constants';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import DocumentPicker from 'react-native-document-picker';
import React, {useState, useEffect} from 'react';
import Toast from 'react-native-toast-message';

export default function Verification({route, navigation}) {
  const {user} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setEnabled] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentLabels, setSelectedDocumentLabels] = useState({
    document1: 'No Document Selected',
    document2: 'No Document Selected',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let URL = BASE_URL;
        axios
          .get(URL + '?tag=check_ifsubmitted' + '&user_id=' + user, {
            headers: {
              'Auth-Key': AUTH_KEY,
              'Cache-Control': 'no-cache'},
          })
          .then(res => {
            console.log(res.data);
            switch (res.data) {
              case 0: //pending
                Alert.alert(
                  'StudyHive',
                  'Your uploaded documents are currently being reviewed. Please allow at least 24 hours for the verification process.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Profile Tab'),
                    },
                  ],
                  {cancelable: false},
                );
                setEnabled(true);
                break;
              case 1: //approved
                Alert.alert(
                  'StudyHive',
                  'Your uploaded documents are verified! please contact the administrator if you want to change your submitted documents.',
                  [
                    {
                      text: 'OK',
                      onPress: () => navigation.navigate('Profile Tab'),
                    },
                  ],
                  {cancelable: false},
                );
                setEnabled(true);
                break;
            }
          })
          .catch(error => {
            Toast.show({
              type: 'error',
              text1: 'StudyHive',
              text2: 'An error occured. Please try again.',
            });
            navigation.navigate('Profile Tab');
          });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: 'An error occured. Please try again.',
        });
        navigation.navigate('Profile Tab');
      }
    };

    fetchData();
  }, []);

  const handleDocumentSelection = async label => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.docx, DocumentPicker.types.doc, DocumentPicker.types.images],
      });

      // Check if document is already selected
      if (
        (label === 'document1' &&
          results[0].name === selectedDocumentLabels.document2) ||
        (label === 'document2' &&
          results[0].name === selectedDocumentLabels.document1)
      ) {
        Alert.alert('Dorm Finder', 'You have already selected this document');
        return;
      }

      setDocuments(prevDocuments => [...prevDocuments, ...results]);
      setSelectedDocumentLabels(prevLabels => ({
        ...prevLabels,
        [label]: results[0].name,
      }));
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        // Error occurred
      }
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    // Check if two documents are selected
    if (documents.length !== 2) {
      Alert.alert('Please select two documents');
      return;
    }

    const formData = new FormData();
    formData.append('tag', 'send_document');
    formData.append('document1', {
      uri: documents[0].uri,
      type: documents[0].type,
      name: documents[0].name,
    });
    formData.append('document2', {
      uri: documents[1].uri,
      type: documents[1].type,
      name: documents[1].name,
    });
    formData.append('document2', documents[1]);
    formData.append('user_id', user);

    const response = axios.post(BASE_URL, formData, {
      headers: {
        'Auth-Key': AUTH_KEY,
        'Content-Type': 'multipart/form-data',
      },
    });

    response
      .then(res => {
        Alert.alert('StudyHive', res.data);
      })
      .catch(error => {
        console.error('Error occurred during the Axios request:', error);
        Toast.show({
          type: 'error',
          text1: 'StudyHive',
          text2: 'An error occured',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.heading1}>
          Please upload the following documents to proceed on posting a listing
        </Text>
        <Text style={{textAlign: 'center', marginBottom: -20}}>
          Only PDF, DOC, DOCX, JPG, and PNG are allowed
        </Text>
      </View>
      <View
        style={[
          styles.section,
          {
            borderStyle: 'dashed',
            borderRadius: 20,
            borderWidth: 1,
          },
        ]}>
        <Text style={styles.heading}>
          Upload DTI Certificate or SEC Certificate of Registration
        </Text>
        {selectedDocumentLabels.document1 !== '' && (
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
            {selectedDocumentLabels.document1}
          </Text>
        )}
        <TouchableOpacity
          disabled={isEnabled}
          style={styles.button}
          onPress={() => handleDocumentSelection('document1')}>
          <Text style={styles.buttonText}>Select Document</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[
          styles.section,
          {
            borderStyle: 'dashed',
            borderRadius: 20,
            borderWidth: 1,
          },
        ]}>
        <Text style={styles.heading}>
          Upload Contract of Lease or Tax Declaration
        </Text>
        {selectedDocumentLabels.document2 !== '' && (
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="tail">
            {selectedDocumentLabels.document2}
          </Text>
        )}
        <TouchableOpacity
          disabled={isEnabled}
          style={styles.button}
          onPress={() => handleDocumentSelection('document2')}>
          <Text style={styles.buttonText}>Select Document</Text>
        </TouchableOpacity>
      </View>

      {/* {documents.length === 2 && (
        <Text style={styles.fileName}>
          Selected documents: {documents[0].name}, {documents[1].name}
        </Text>
      )} */}

      <View style={styles.submitBtn}>
        <TouchableOpacity
          style={[
            styles.button,
            {backgroundColor: documents.length !== 2 ? '#CCCCCC' : '#0E898B'},
          ]}
          onPress={handleSubmit}
          disabled={documents.length !== 2 || isLoading}>
          {isLoading ? (
            <ActivityIndicator size={'small'} color={'#FFFFFF'} />
          ) : (
            <Text style={styles.buttonText}>Submit</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  section: {
    marginVertical: 12,
    padding: 16,
  },
  heading1: {
    fontSize: 20,
    marginTop: -15,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  heading: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  button: {
    backgroundColor: '#0E898B',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
  },
  submitBtn: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  fileName: {
    marginBottom: 10,
    textAlign: 'center',
  },
});

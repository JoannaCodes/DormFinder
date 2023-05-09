import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios'
import {BASE_URL} from '../../../constants'

export default function DocumentStatus() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentLabels, setSelectedDocumentLabels] = useState({
    document1: 'No Document Selected',
    document2: 'No Document Selected',
  });

  const handleDocumentSelection = async (label) => {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.pdf,
          DocumentPicker.types.docx,
        ],
      });

      // Check if document is already selected
      if (
        (label === 'document1' && results[0].name === selectedDocumentLabels.document2) ||
        (label === 'document2' && results[0].name === selectedDocumentLabels.document1)
      ) {
        alert('You have already selected this document');
        return;
      }

      setDocuments((prevDocuments) => [...prevDocuments, ...results]);
      setSelectedDocumentLabels((prevLabels) => ({
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
    // Check if two documents are selected
    if (documents.length !== 2) {
      alert('Please select two documents');
      return;
    }

    const formData = new FormData();
    formData.append('tag', 'send_document');
    formData.append('document1', {
      uri: documents[0]['uri'],
      type: documents[0]['type'],
      name: documents[0]['name'],
    });
    formData.append('document2', {
      uri: documents[1]['uri'],
      type: documents[1]['type'],
      name: documents[1]['name'],
    });
    formData.append('document2', documents[1]);

     const response = axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Upload success:', response.data);

    Alert.alert('Upload success', 'The document file was successfully uploaded to the server.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Upload Documents</Text>
      {selectedDocumentLabels.document1 !== '' && (
        <Text style={styles.fileName}>
          Document 1: {selectedDocumentLabels.document1}
        </Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDocumentSelection('document1')}>
        <Text style={styles.buttonText}>Select Document 1</Text>
      </TouchableOpacity>
      


      {selectedDocumentLabels.document2 !== '' && (
        <Text style={styles.fileName}>
          Document 2: {selectedDocumentLabels.document2}
        </Text>
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleDocumentSelection('document2')}>
        <Text style={styles.buttonText}>Select Document 2</Text>
      </TouchableOpacity>
      
      {documents.length === 2 && (
        <Text style={styles.fileName}>
          Selected documents: {documents[0].name}, {documents[1].name}
        </Text>
      )}
      <Button
        title="Submit"
        onPress={handleSubmit}
        disabled={documents.length !== 2}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  fileName: {
    marginBottom: 10,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

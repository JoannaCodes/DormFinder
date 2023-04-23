import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function DocumentStatus() {
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Document 1', status: 'Not yet verified' },
    { id: 2, name: 'Document 2', status: 'Verified' },
  ]);

  const handlePressSubmit = (documentId) => {
    setDocuments((prevState) =>
      prevState.map((doc) =>
        doc.id === documentId ? { ...doc, status: 'Submitted' } : doc
      )
    );
  };

  return (
    <View style={styles.container}>
      {documents.map((doc) => (
        <View key={doc.id} style={styles.document}>
          <Text style={styles.documentName}>{doc.name}</Text>
          <Text style={styles.documentStatus}>{doc.status}</Text>
          {doc.status !== 'Submitted' && (
            <TouchableOpacity
              onPress={() => handlePressSubmit(doc.id)}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  document: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  documentName: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  documentStatus: {
    color: '#888',
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  submitButtonText: {
    color: '#fff',
  },
});
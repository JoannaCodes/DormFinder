import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyALAMFOYDssmxVU6e_Spi3kxEdH2fM-_a0",
  authDomain: "dorm-finder.firebaseapp.com",
  projectId: "dorm-finder",
  storageBucket: "dorm-finder.appspot.com",
  messagingSenderId: "656193437493",
  appId: "1:656193437493:web:f47ee417760b5b61b0967c"
};

// Initialize Firebase
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) :firebase.app()

export default firebase
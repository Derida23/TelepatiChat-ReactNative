import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyA6dkkkDSftTzTTyW97niHqjzlWjtb99cM",
  authDomain: "telepati-core.firebaseapp.com",
  databaseURL: "https://telepati-core.firebaseio.com",
  projectId: "telepati-core",
  storageBucket: "telepati-core.appspot.com",
  messagingSenderId: "365740489718",
  appId: "1:365740489718:web:0f6d9e445408632b5f65d7",
  measurementId: "G-DYQN9Y8X52"
};

let app = firebase.initializeApp(firebaseConfig);

export const Database = app.database();
export const Auth = app.auth();

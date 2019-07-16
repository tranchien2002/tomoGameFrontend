import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

var config = {
  apiKey: "AIzaSyCAtg8AwpPNfSCchbGf6m9iivQ8Q3H5XOs",
  authDomain: "hunter-31765.firebaseapp.com",
  databaseURL: "https://hunter-31765.firebaseio.com",
  projectId: "hunter-31765",
  storageBucket: "hunter-31765.appspot.com",
  messagingSenderId: "633708017779"
};

firebase.initializeApp(config);

export default firebase;

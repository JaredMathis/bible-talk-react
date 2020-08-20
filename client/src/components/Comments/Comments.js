import React from 'react';
import PropTypes from 'prop-types';
import './Comments.css';

import * as firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import SignInOut from '../SignInOut/SignInOut';

const firebaseConfig = {
  apiKey: "AIzaSyDXHdYSYFFcFSkO_x5RyO7vldjFziPjOFI",
  authDomain: "wlj-bible-talk.firebaseapp.com",
  databaseURL: "https://wlj-bible-talk.firebaseio.com",
  projectId: "wlj-bible-talk",
  storageBucket: "wlj-bible-talk.appspot.com",
  messagingSenderId: "122255200891",
  appId: "1:122255200891:web:29cd80344b9600228c48de",
  measurementId: "G-VZ522T6GD7"
};

class Comments extends React.Component {
  render() {
    return (
      <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
        <SignInOut></SignInOut>
      </FirebaseAuthProvider>
    );
  }
};

export default Comments;

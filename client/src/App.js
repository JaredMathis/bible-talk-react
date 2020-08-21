import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import _ from 'lodash';
import Comments from './components/Comments/Comments';
import Verse from './components/Verse/Verse';

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
  apiKey: "AIzaSyDXHdYSYFFcFSkO_x5RyO7vldjFziPjOFI",
  authDomain: "wlj-bible-talk.firebaseapp.com",
  databaseURL: "https://wlj-bible-talk.firebaseio.com",
  projectId: "wlj-bible-talk",
  storageBucket: "wlj-bible-talk.appspot.com",
  messagingSenderId: "122255200891",
  appId: "1:122255200891:web:29cd80344b9600228c48de",
  measurementId: "G-VZ522T6GD7"
};
firebase.initializeApp(config);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    firebase.firestore().collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snaps) => {
        console.log('onSnapshot');
        const comments = [];
        snaps.forEach((doc) => {
          comments.push(doc.data());
        });
        this.setState({ comments });
      });
  }
  keyChanged = (verseKey) => {
    this.setState({ verseKey });
  }
  render() {
    return (
      <>
        <Verse onKeyChanged={this.keyChanged} />
        <Comments
          verseKey={this.state.verseKey}
          firebase={firebase}
          config={config}
          comments={this.state.comments} />
      </>
    );
  }
}

export default App;

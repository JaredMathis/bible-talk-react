import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import _ from 'lodash';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import * as firebase from "firebase/app";
import "firebase/auth";
import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";

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

const url = 'http://bible-api.s3-website-us-east-1.amazonaws.com/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    axios.get(url + 'translation/kjv/books.json').then(response => {
      let books = response.data.map(b => {
        return {
          name: b.replace('-', ' '),
          id: b,
        }
      });
      this.setState({ books });
      this.updateBook(books[0].name);
    });
  }
  bookChanged = (e) => {
    let name = e.target.value;
    this.updateBook(name);
  }
  updateBook = (name) => {
    this.setState({ selectedBook: name });
    axios.get(url + 'translation/kjv/book/' + name + '/chapters.json').then(response => {
      const chapters = response.data;
      this.setState({ chapters });
      this.updateChapter(chapters[0]);
    });
  }
  chapterChanged = (e) => {
    let name = e.target.value;
    this.updateChapter(name);
  }
  updateChapter = (c) => {
    this.setState({ selectedChapter: c });
    axios.get(url + 'translation/kjv/book/'
      + this.state.selectedBook + '/chapter/'
      + c + '/verses.json').then(response => {
        const verses = response.data;
        this.setState({ verses });
        this.updateVerse(verses[0]);
      });
  }
  verseChanged = (e) => {
    let name = e.target.value;
    this.updateVerse(name);
  }
  updateVerse = (v) => {
    this.setState({ selectedVerse: v });
    this.setState({ verse: '' });
    axios.get(url + 'translation/kjv/book/'
      + this.state.selectedBook + '/chapter/'
      + this.state.selectedChapter + '/verse/'
      + v + '.json').then(response => {
        const verse = response.data.text;
        console.log({ verse });
        this.setState({ verse });
      });
  }
  render() {
    let books = this.state.books
      && this.state.books.map(b =>
        <option key={b.id}>
          {b.name}
        </option>);
    let chapters = this.state.chapters
      && this.state.chapters.map(c =>
        <option key={c}>
          {c}
        </option>);
    let verses = this.state.verses
      && this.state.verses.map(v =>
        <option key={v}>
          {v}
        </option>);
    return (
      <>
        <Form.Group>
          <Form.Label>Book</Form.Label>
          <Form.Control as="select"
            onChange={this.bookChanged}
            value={this.state.selectedBook}>
            {books}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Chapter</Form.Label>
          <Form.Control as="select"
            onChange={this.chapterChanged}
            value={this.state.selectedChapter}>
            {chapters}
          </Form.Control>
        </Form.Group>
        <Form.Group>
          <Form.Label>Verse</Form.Label>
          <Form.Control as="select"
            onChange={this.verseChanged}
            value={this.state.selectedVerse}>
            {verses}
          </Form.Control>
        </Form.Group>
        <div>
          {this.state.verse}
        </div>
        <FirebaseAuthProvider firebase={firebase} {...firebaseConfig}>
          <FirebaseAuthConsumer>
            {({ isSignedIn, firebase }) => {
              if (isSignedIn === true) {
                return (
                  <div>
                    <h2>You're signed in 🎉</h2>
                    <button
                      onClick={() => {
                        firebase
                          .app()
                          .auth()
                          .signOut();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                );
              } else {
                return (
                  <div>
                    <h2>You're not signed in </h2>
                    <button
                      onClick={() => {
                        firebase
                          .app()
                          .auth()
                          .signInAnonymously();
                      }}
                    >
                      Sign in anonymously
                    </button>
                  </div>
                );
              }
            }}
          </FirebaseAuthConsumer>
        </FirebaseAuthProvider>
      </>
    );
  }
}

export default App;

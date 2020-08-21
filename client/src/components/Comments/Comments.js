import React from 'react';
import PropTypes from 'prop-types';
import './Comments.css';

import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
  IfFirebaseAuthed,
  IfFirebaseAuthedAnd
} from "@react-firebase/auth";
import SignInOut from '../SignInOut/SignInOut';

import { Button, FormControl } from "react-bootstrap";

import {
  FirestoreProvider,
  FirestoreCollection,
  FirestoreMutation,
} from '@react-firebase/firestore';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      comments: [],
    };

    console.log({props})
  }
  render() {
    console.log('rendered');
    if (!this.props.firebase) {
      return null;
    }
    if (!this.props.comments) {
      return null;
    }
    console.log({c:this.props.comments})
    const comments = 
      this.props.comments
      .filter(c => c.verseKey === this.props.verseKey)
      .map(c => <div>{c.name}: {c.text}</div>);
    return (
      <FirebaseAuthProvider firebase={this.props.firebase} {...this.props.config}>
        <SignInOut></SignInOut>

        <FirestoreProvider firebase={this.props.firebase} {...this.props.config}>
          <FormControl
            onChange={(e) =>
              this.setState({ commentText: e.target.value })
            }
            value={this.state.commentText}></FormControl>
          <Button
            disabled={!this.state.commentText}
            onClick={() => {
              let { currentUser } = this.props.firebase.auth();
              let d = {
                text: this.state.commentText,
                timestamp: Date.now(),
                name: currentUser.displayName,
                verseKey: this.props.verseKey,
              };
              this.props.firebase.firestore().collection("comments").add(d);
              this.setState({ commentText: '' })
            }}>Comment</Button>
          {comments}
        </FirestoreProvider>
      </FirebaseAuthProvider>
    );
  }
};

export default Comments;

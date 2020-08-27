import React from 'react';
import { DiscussionEmbed } from 'disqus-react';
import './Comments.css';

import {
  FirebaseAuthProvider,
  FirebaseAuthConsumer,
} from "@react-firebase/auth";
import SignInOut from '../SignInOut/SignInOut';

import {
  Button,
  FormControl,
  ListGroup,
  ListGroupItem,
  Card,
  InputGroup,
} from "react-bootstrap";

import {
  FirestoreProvider,
} from '@react-firebase/firestore';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commentText: '',
      comments: [],
    };
  }
  render() {
    if (!this.props.firebase) {
      return null;
    }
    if (!this.props.comments) {
      return null;
    }
    //console.log({ c: this.props.comments })
    const comments =
      this.props.comments
        .filter(c => c.verseKey === this.props.verseKey)
        .map((c, index) =>
          <ListGroupItem key={index}>
            {c.name}: {c.text}
          </ListGroupItem>);
    return (
      <Card className="mt-2">
        <Card.Body>
          <FirebaseAuthProvider firebase={this.props.firebase} {...this.props.config}>
            <SignInOut className="mt-2"></SignInOut>

            <FirestoreProvider firebase={this.props.firebase} {...this.props.config}>
              <FirebaseAuthConsumer>
                {({ isSignedIn, firebase }) => {
                  if (isSignedIn === true) {
                    return (
                      <InputGroup className="mt-2">
                        <FormControl
                          onChange={(e) =>
                            this.setState({ commentText: e.target.value })
                          }
                          value={this.state.commentText}></FormControl>
                        <InputGroup.Append>
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
                        </InputGroup.Append>
                      </InputGroup>
                    );
                  }
                }}
              </FirebaseAuthConsumer>
              <ListGroup className="mt-2">
                {comments}
              </ListGroup>
            </FirestoreProvider>
          </FirebaseAuthProvider>
          <DiscussionEmbed
            shortname='bible-talk'
            config={
              {
                url: 'https://wlj-bible-talk.web.app',
                identifier: this.props.verseKey,
                title: this.props.verseKey
              }
            }
          />
        </Card.Body></Card>
    );
  }
};

export default Comments;

import React from 'react';
import './SignInOut.css';
import { Button } from "react-bootstrap";

import {
  FirebaseAuthConsumer,
} from "@react-firebase/auth";

class SignInOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <FirebaseAuthConsumer>
        {({ isSignedIn, firebase }) => {
          if (isSignedIn === true) {
            return (
              <div>
                <Button
                  onClick={() => {
                    firebase
                      .app()
                      .auth()
                      .signOut();
                    this.setState({ disabled: false });
                  }}
                >
                  Sign out
      </Button>
              </div>
            );
          } else {
            return (
              <div>
                <Button
                  disabled={this.state.disabled}
                  onClick={() => {
                    this.setState({ disabled: true });

                    const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
                    firebase.auth().signInWithPopup(googleAuthProvider);
                  }}
                >
                  Sign in with Google
            </Button>
              </div>
            );
          }
        }}
      </FirebaseAuthConsumer>
    );
  }
}

export default SignInOut;

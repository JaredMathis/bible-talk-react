import React from 'react';
import PropTypes from 'prop-types';
import './SignInOut.css';

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
                <button
                  disabled={this.state.disabled}
                  onClick={() => {
                    this.setState({ disabled: true });
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
    );
  }
}

export default SignInOut;

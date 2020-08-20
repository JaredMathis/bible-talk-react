import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import axios from 'axios';
import _ from 'lodash';
import { Form, Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import Comments from './components/Comments/Comments';
import Verse from './components/Verse/Verse';

class App extends React.Component {
  render() {
    return (
      <>
        <Verse />
        <Comments />
      </>
    );
  }
}

export default App;

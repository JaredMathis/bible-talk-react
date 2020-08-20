import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import _ from 'lodash';
import Comments from './components/Comments/Comments';
import Verse from './components/Verse/Verse';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  keyChanged = (verseKey) => {
    this.setState({verseKey});
  }
  render() {
    return (
      <>
        <Verse onKeyChanged={this.keyChanged} />
        <Comments verseKey={this.state.verseKey} />
      </>
    );
  }
}

export default App;

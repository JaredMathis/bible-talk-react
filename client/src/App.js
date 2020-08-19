import React from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';

const url = 'http://bible-api.s3-website-us-east-1.amazonaws.com/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }
  componentDidMount = () => {
    axios.get(url + 'translation/kjv/books.json').then(response => {
      let books = response.data;
      this.setState({books});
      console.log({books});
    });
  }
  render() {
    let list = this.state.books.map(b => <div>{b}</div>);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {list}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
}

export default App;

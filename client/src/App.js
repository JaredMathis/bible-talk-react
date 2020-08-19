import React from 'react';
import './App.css';
import axios from 'axios';
import _ from 'lodash';

const url = 'http://bible-api.s3-website-us-east-1.amazonaws.com/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { books: [] };
  }
  componentDidMount = () => {
    axios.get(url + 'translation/kjv/books.json').then(response => {
      let books = response.data.map(b => { 
        console.log({b})
        return {
          name: b.replace('-', ' '),
          id: b,
        }
      });
      this.setState({books});
      this.setState({selectedBook:books[0].name});
    });
  }
  bookChanged = (e) => {
    let name = e.target.value;
    this.setState({selectedBook:name});
  }
  render() {
    let list = this.state.books.map(b => 
      <option key={b.id}>
        {b.name}
      </option>);
    return (
      <div>
        <select onChange={this.bookChanged}>
          {list}
        </select>
        <span>
          {this.state.selectedBook}
        </span>
      </div>
    );
  }
}

export default App;

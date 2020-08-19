import React from 'react';
import './App.css';
import axios from 'axios';
import _ from 'lodash';

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
      this.setState({books});
      this.updateBook(books[0].name);
    });
  }
  bookChanged = (e) => {
    let name = e.target.value;
    this.updateBook(name);
  }
  updateBook = (name) => {
    this.setState({selectedBook:name});
    axios.get(url + 'translation/kjv/book/' + name + '/chapters.json').then(response => {
      const chapters = response.data;
      this.setState({chapters});
      this.updateChapter(chapters[0]);
    });
  }
  chapterChanged = (e) => {
    let name = e.target.value;
    this.updateChapter(name);
  }
  updateChapter = (name) => {
    this.setState({selectedChapter:name});

    console.log('updateChapter');
    axios.get(url + 'translation/kjv/book/' 
      + this.state.selectedBook + '/chapter/' 
      + this.state.selectedChapter + '/verses.json').then(response => {
      this.setState({verses: response.data});
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
      <div>
        <select onChange={this.bookChanged}>
          {books}
        </select>
        <select onChange={this.chapterChanged}>
          {chapters}
        </select>
        <select onChange={this.verseChanged}>
          {verses}
        </select>
      </div>
    );
  }
}

export default App;

import React from 'react';
import './Verse.css';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import _ from 'lodash';

const url = 'https://bible-api.s3.amazonaws.com/';

class Verse extends React.Component {
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
    console.log('updateChapter', { c });
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
    console.log('updateVerse', { v });
    this.setState({ selectedVerse: v });
    this.setState({ verse: '' });
    axios.get(url + 'translation/kjv/book/'
      + this.state.selectedBook + '/chapter/'
      + this.state.selectedChapter + '/verse/'
      + v + '.json').then(response => {
        const verse = response.data.text;
        this.setState({ verse });
      });
    let key = [
      this.state.selectedBook,
      this.state.selectedChapter,
      v
    ].join('.');
    this.props.onKeyChanged(key);
  }
  nextBook = () => {
    let currentBook = _.find(this.state.books, { name: this.state.selectedBook });
    let currentIndex = this.state.books.indexOf(currentBook);
    let nextIndex = currentIndex + 1;
    if (nextIndex > this.state.books.length - 1) {
      nextIndex = 0;
    }
    let nextBook = this.state.books[nextIndex];
    this.updateBook(nextBook.name);
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
        <Button
          onClick={() => {
            let nextVerse = (parseInt(this.state.selectedVerse, 10) + 1) + "";
            if (this.state.verses.includes(nextVerse)) {
              this.updateVerse(nextVerse);
            } else {
              let nextChapter = (parseInt(this.state.selectedChapter, 10) + 1) + "";
              if (this.state.chapters.includes(nextChapter)) {
                this.updateChapter(nextChapter);
              } else {
                this.nextBook();
              }
            }
          }}
        >
          Next verse
        </Button>
        <div className="mt-2">
          {this.state.verse}
        </div>
      </>
    );
  }
}

export default Verse;

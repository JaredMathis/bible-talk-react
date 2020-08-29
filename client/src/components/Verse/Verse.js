import React from 'react';
import './Verse.css';
import axios from 'axios';
import { Form, Button } from "react-bootstrap";
import _ from 'lodash';

const url = 'https://bible-api.s3.amazonaws.com/';

const version = 'nkjv';

class Verse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount = () => {
    axios.get(url + `translation/${version}/books.json`).then(response => {
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
  updateBook = (name, last) => {
    this.setState({ selectedBook: name });
    let currentBook = this.getBook(name);
    axios.get(url + 'translation/' + version + '/book/' + currentBook.id + 
      '/chapters.json').then(response => {
      const chapters = response.data;
      this.setState({ chapters });
      let chapter = last ? chapters.length - 1 : 0;
      this.updateChapter(chapters[chapter], last);
    });
  }
  chapterChanged = (e) => {
    let name = e.target.value;
    this.updateChapter(name);
  }
  updateChapter = (c, last) => {
    this.setState({ selectedChapter: c });
    let currentBook = this.getCurrentBook();
    axios.get(url + 'translation/' + version + '/book/'
      + currentBook.id + '/chapter/'
      + c + '/verses.json').then(response => {
        const verses = response.data;
        this.setState({ verses });
        let verse = last ? verses.length - 1 : 0;
        this.updateVerse(verses[verse]);
      });
  }
  verseChanged = (e) => {
    let name = e.target.value;
    this.updateVerse(name);
  }
  updateVerse = (v) => {
    let currentBook = this.getCurrentBook();
    this.setState({ selectedVerse: v });
    this.setState({ verse: '' });
    axios.get(url + 'translation/' + version + '/book/'
      + currentBook.id + '/chapter/'
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
  getCurrentBookIndex = () => {
    let currentBook = this.getCurrentBook();
    let currentIndex = this.state.books.indexOf(currentBook);
    return currentIndex;
  }
  getCurrentBook = () => {
    return this.getBook(this.state.selectedBook);
  }
  getBook = (name) => {
    let currentBook = _.find(this.state.books, { name });
    return currentBook;
  }
  nextBook = () => {
    let currentIndex = this.getCurrentBookIndex();
    let nextIndex = currentIndex + 1;
    if (nextIndex > this.state.books.length - 1) {
      nextIndex = 0;
    }
    let nextBook = this.state.books[nextIndex];
    this.updateBook(nextBook.name);
  }
  previousBook = () => {
    let currentIndex = this.getCurrentBookIndex();
    let previousIndex = currentIndex - 1;
    if (previousIndex < 0) {
      previousIndex = this.state.books.length - 1;
    }
    let previousBook = this.state.books[previousIndex];
    this.updateBook(previousBook.name, true);
  }
  redirectInterlinear = () => {
    let book = this.state.selectedBook.replace(' ','_').toLowerCase();
    let chapter = this.state.selectedChapter;
    let verse = this.state.selectedVerse;
    window.location.href = `https://biblehub.com/interlinear/${book}/${chapter}-${verse}.htm`;
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
          className="ml-1"
          onClick={() => {
            let previousVerse = (parseInt(this.state.selectedVerse, 10) - 1) + "";
            if (this.state.verses.includes(previousVerse)) {
              this.updateVerse(previousVerse);
            } else {
              let previousChapter = (parseInt(this.state.selectedChapter, 10) - 1) + "";
              if (this.state.chapters.includes(previousChapter)) {
                this.updateChapter(previousChapter);
              } else {
                this.previousBook();
              }
            }
          }}
        >
          Previous verse
        </Button>
        <Button
          className="ml-1"
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
        <Button
          className="ml-1"
          onClick={() => this.redirectInterlinear()}
        >
          Interlinear
        </Button>
        <div className="mt-2">
          {this.state.verse}
        </div>
      </>
    );
  }
}

export default Verse;

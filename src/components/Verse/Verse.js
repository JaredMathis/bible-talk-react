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
  componentDidMount = async () => {
    let response = await axios.get(url + `translations.json`);
    let translations = response.data.map(b => {
      return {
        name: b.toUpperCase(),
        id: b,
      }
    });
    this.setState({ translations });
    this.updateTranslation(translations[0].name);
  }
  updateTranslation = (name) => {
    this.setState({ selectedTranslation: name });
    let translation = this.getTranslation(name);
    axios.get(url + `translation/${translation.id}/books.json`).then(response => {
      let books = response.data.map(b => {
        return {
          name: b.replace('-', ' '),
          id: b,
        }
      });
      this.setState({ books });
      if (books.map(b => b.name).includes(this.state.selectedBook)) {
        this.refreshVerse();
      } else {
        this.updateBook(books[0].name);
      }
    });
  }
  getTranslation = (name) => {
    let translation = _.find(this.state.translations, { name });
    return translation;
  }
  getCurrentTranslation = () => {
    let translation = this.getTranslation(this.state.selectedTranslation);
    return translation;
  }
  translationChanged = (e) => {
    let name = e.target.value;
    this.updateTranslation(name);
  }
  bookChanged = (e) => {
    let name = e.target.value;
    this.updateBook(name);
  }
  updateBook = (name, last) => {
    this.setState({ selectedBook: name });
    let currentBook = this.getBook(name);
    let translation = this.getCurrentTranslation();
    axios.get(url + 'translation/' + translation.id + '/book/' + currentBook.id +
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
    let translation = this.getCurrentTranslation();
    axios.get(url + 'translation/' + translation.id + '/book/'
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
    this.setState({ selectedVerse: v });

    this.refreshVerse(v);

    let key = [
      this.state.selectedBook,
      this.state.selectedChapter,
      v
    ].join('.');
    this.props.onKeyChanged(key);
  }
  refreshVerse = (v) => {
    let currentBook = this.getCurrentBook();
    let translation = this.getCurrentTranslation();
    this.setState({ verse: '' });
    axios.get(url + 'translation/' + translation.id + '/book/'
      + currentBook.id + '/chapter/'
      + this.state.selectedChapter + '/verse/'
      + (v || this.state.selectedVerse) + '.json').then(response => {
        const verse = response.data.text;
        this.setState({ verse });
      });
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
    let book = this.state.selectedBook.replace(' ', '_').toLowerCase();
    let chapter = this.state.selectedChapter;
    let verse = this.state.selectedVerse;
    let url = `https://biblehub.com/interlinear/${book}/${chapter}-${verse}.htm`;
    window.open(url,'_blank');
  }
  render() {
    let translations = this.state.translations
      && this.state.translations.map(b =>
        <option key={b.id}>
          {b.name}
        </option>);
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
          <Form.Label>Translation</Form.Label>
          <Form.Control as="select"
            onChange={this.translationChanged}
            value={this.state.selectedTranslation}>
            {translations}
          </Form.Control>
        </Form.Group>
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

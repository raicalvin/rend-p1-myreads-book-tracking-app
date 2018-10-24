import React, { Component } from "react";
import BookShelf from "./BookShelf";
import * as BooksAPI from "../BooksAPI";
import { Link } from "react-router-dom";
/**
 * MAIN PAGE for the BOOKS Page
 */

class BooksPage extends Component {
  // Anytime state changes, the UI will update automatically
  state = {
    boxOfBooks: [],
    booksCurrentlyReading: [],
    booksWantToRead: [],
    booksAlreadyRead: []
  };

  // Get a list of all the books here with AJAX request
  componentDidMount() {
    // this will run right after the component is added to the DOM
    BooksAPI.getAll().then(books => {
      // sort all the books first into vairables
      let tBoxOfBooks = books;
      let tBooksCurrentlyReading = books.filter(
        book => book.shelf === "currentlyReading"
      );
      let tBooksWantToRead = books.filter(book => book.shelf === "wantToRead");
      let tBooksAlreadyRead = books.filter(book => book.shelf === "read");
      this.setState({
        boxOfBooks: tBoxOfBooks,
        booksCurrentlyReading: tBooksCurrentlyReading,
        booksWantToRead: tBooksWantToRead,
        booksAlreadyRead: tBooksAlreadyRead
      });
    });
  }

  // this function will handle state management when the user selects a new category
  // we're using this patten since we are updating the state based on the current state
  changeBookCategory(shelfCatValue, bookNameValue, bookId, bookObj) {
    console.log(bookObj);
    // Now we need to call setState here and update the state in this BooksPage component
    BooksAPI.update({ id: bookId }, shelfCatValue).then(obj => {
      BooksAPI.getAll().then(books => {
        let tBoxOfBooks = books;
        let tBooksCurrentlyReading = books.filter(
          book => book.shelf === "currentlyReading"
        );
        let tBooksWantToRead = books.filter(
          book => book.shelf === "wantToRead"
        );
        let tBooksAlreadyRead = books.filter(book => book.shelf === "read");
        this.setState({
          boxOfBooks: tBoxOfBooks,
          booksCurrentlyReading: tBooksCurrentlyReading,
          booksWantToRead: tBooksWantToRead,
          booksAlreadyRead: tBooksAlreadyRead
        });
      });
    });
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <BookShelf
              shelfTitle="Currently Reading"
              booksInThisShelf={this.state.booksCurrentlyReading}
              onBookChange={this.changeBookCategory.bind(this)}
              from="BooksPage"
            />
            <BookShelf
              shelfTitle="Want to Read"
              booksInThisShelf={this.state.booksWantToRead}
              onBookChange={this.changeBookCategory.bind(this)}
              from="BooksPage"
            />
            <BookShelf
              shelfTitle="Read"
              booksInThisShelf={this.state.booksAlreadyRead}
              onBookChange={this.changeBookCategory.bind(this)}
              from="BooksPage"
            />
          </div>
        </div>
        <div className="open-search">
          <Link
            to="/search"
            onClick={() => this.setState({ showSearchPage: true })}
          >
            Add a book
          </Link>
        </div>
      </div>
    );
  }
}

export default BooksPage;

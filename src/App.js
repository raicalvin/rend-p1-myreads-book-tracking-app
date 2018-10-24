import React, { Component } from "react";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import { Link } from "react-router-dom";
import { Route } from "react-router-dom";
import Book from "./components/Book";

/*
========== This is for an individual bookshelf ===========
*/
class BookShelf extends Component {
  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.shelfTitle}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.booksInThisShelf.map(book => (
              <Book
                title={book.title}
                author={book.authors}
                image={book.imageLinks.thumbnail}
                shelf={book.shelf}
                key={book.id}
                bookId={book.id}
                onBookChange={this.props.onBookChange}
                from={this.props.from}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
}

/*
========== Main Page for the BOOKS Page ===========
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

/*
========== Main Page for the SEARCH Page ===========
*/
class SearchPage extends Component {
  state = {
    placeholderText: "Search by title or author",
    query: "",
    searchBookList: [],
    defaultShelf: "none"
  };

  showLiveResults = event => {
    try {
      if (this.state.searchBookList.length !== 0) {
        this.setState({ searchBookList: [] });
      }
      if (event.length !== 0) {
        BooksAPI.search(event).then(results => {
          if (!results.error) {
            results.forEach(bk => {
              bk.shelf = "none"; // place all books on none initially
            });

            BooksAPI.getAll().then(books => {
              // do something to results
              for (let i = 0; i < books.length; i++) {
                let cBook = books[i];
                for (let j = 0; j < results.length; j++) {
                  let cResult = results[j];
                  if (cBook.id === cResult.id) {
                    results[j].shelf = cBook.shelf;
                    console.log(results[j].shelf);
                  }
                }
              }

              this.setState({
                searchBookList: results
              });
            });
          }
        });
      }
    } catch (err) {
      alert("Please enter valid search results");
    }
  };

  searchBookCategoryChanged(shelfValue, bookToAdd) {
    bookToAdd.shelf = shelfValue;
    BooksAPI.update(bookToAdd, shelfValue).then(console.log("Book updated"));
    this.forceUpdate();
  }

  render() {
    console.log(this.state.searchBookList);
    let list;
    if (this.state.searchBookList !== undefined) {
      list = this.state.searchBookList.map(bk => (
        <Book
          obj={bk}
          title={bk.title}
          author={bk.authors}
          image={bk.imageLinks.thumbnail}
          shelf={bk.shelf} // change this based on new filtered list
          key={bk.id}
          bookId={bk.id}
          onBookAdd={this.searchBookCategoryChanged.bind(this)}
          from="SearchPage"
        />
      ));
    }

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to="/" className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
            <input
              type="text"
              placeholder={this.state.placeholderText}
              onChange={e => this.showLiveResults(e.target.value)}
              value={this.state.placeholderTextquery}
            />
          </div>
        </div>
        {/*Add the search results to this grid below*/}
        <div className="search-books-results">
          <ol className="books-grid">{list}</ol>
        </div>
      </div>
    );
  }
}

/*
========== PARENT MAIN Page ===========
*/
class BooksApp extends Component {
  state = {
    showSearchPage: false
  };

  onNavigateBack() {
    this.setState({ showSearchPage: false });
  }

  render() {
    return (
      <div className="app">
        <Route exact path="/" render={() => <BooksPage />} />
        <Route
          path="/search"
          render={() => <SearchPage onNav={this.onNavigateBack.bind(this)} />}
        />
      </div>
    );
  }
}

export default BooksApp;

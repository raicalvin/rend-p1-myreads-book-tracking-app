import React, { Component } from "react";
import * as BooksAPI from "../BooksAPI";
import { Link } from "react-router-dom";
import Book from "./Book.js";
/**
 * This is the main Search Page where a user can search for books to add to their shelves
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

export default SearchPage;

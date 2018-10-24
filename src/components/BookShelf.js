import React, { Component } from "react";
import Book from "./Book";
/**
 * This component is for an individual bookshelf item (one of three)
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

export default BookShelf;

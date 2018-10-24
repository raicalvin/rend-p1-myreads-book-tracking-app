import React, { Component } from "react";
import Select from "./Select";
/**
 * This component is for an individual Book item
 */

class Book extends Component {
  render() {
    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url(${this.props.image})`
              }}
            />
            <div className="book-shelf-changer">
              <Select
                currentValue={this.props.shelf}
                onBookChange={this.props.onBookChange}
                bookName={this.props.title}
                bookId={this.props.bookId}
                shelf={this.props.shelf}
                obj={this.props.obj}
                from={this.props.from}
                onBookAdd={this.props.onBookAdd}
              />
            </div>
          </div>
          <div className="book-title">{this.props.title}</div>
          <div className="book-authors">{this.props.author}</div>
        </div>
      </li>
    );
  }
}

export default Book;

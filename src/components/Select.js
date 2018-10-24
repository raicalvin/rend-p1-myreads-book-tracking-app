import React, { Component } from "react";
/**
 * This component is for the selection component
 */

class Select extends Component {
  state = {
    bookName: this.props.bookName, // name of the book
    bookId: this.props.bookId // unique id for each book
  };

  render() {
    return (
      <select
        onChange={e => {
          this.props.from === "BooksPage"
            ? this.props.onBookChange(
                e.target.value,
                this.state.bookName,
                this.state.bookId,
                this.props.obj
              )
            : this.props.onBookAdd(e.target.value, this.props.obj);
        }}
        value={this.props.shelf}
      >
        <option value="move" disabled>
          Move to...
        </option>
        <option value="currentlyReading">Currently Reading</option>
        <option value="wantToRead">Want to Read</option>
        <option value="read">Read</option>
        <option value="none">None</option>
      </select>
    );
  }
}

export default Select;

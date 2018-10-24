import React, { Component } from "react";
import "./App.css";
import { Route } from "react-router-dom";
import BooksPage from "./components/BooksPage.js";
import SearchPage from "./components/SearchPage.js";

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
        <Route exact path="/" component={BooksPage} />
        <Route
          path="/search"
          render={() => <SearchPage onNav={this.onNavigateBack.bind(this)} />}
        />
      </div>
    );
  }
}

export default BooksApp;

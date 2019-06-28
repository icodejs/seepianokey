import React, { Component } from 'react';
import { Provider } from "react-redux";
import Home from './pages/Home';
import './App.css';

import configureStore from './common/store';

class App extends Component {
  render() {
    const store = configureStore();

    return (
      <Provider store={store}>
        <div className="App">
          <Home />
        </div>
      </Provider>
    );
  }
}

export default App;

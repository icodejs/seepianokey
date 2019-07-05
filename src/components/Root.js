import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import Home from '../pages/Home';

const Foo = () => {
  return (
    <div>
      <h2>Foo</h2>
    </div>
  );
};

const Root = ({ store }) => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/foo">TBC</Link>
          </li>
        </ul>

        <hr />

        <Route exact path="/" component={Home} />
        <Route path="/foo" component={Foo} />
      </div>
      <Route exact path="/" component={Home} />
    </BrowserRouter>
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object.isRequired
}

export default Root

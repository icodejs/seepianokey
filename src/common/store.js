import { createStore, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';
import reducer from './reducers';

export default function configureStore(initialState) {
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(applyMiddleware(logger)),
  );

  return store;
}

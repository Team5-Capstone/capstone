import { createStore, combineReducers, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import auth from './auth';
import prompts from './prompts';

const reducer = combineReducers({ auth, prompts });
const middleware = applyMiddleware(
  thunkMiddleware,
  createLogger({ collapsed: true }),
);
const store = createStore(reducer, middleware);

export default store;
export * from './auth';
export * from './prompts';

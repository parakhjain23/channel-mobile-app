import {legacy_createStore as createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {persistStore} from 'redux-persist';
import rootReducer from './reducers/Index';
import rootSaga from './Saga';
import createSocketMiddleware from '../utils/Socket';

const sagaMiddleware = createSagaMiddleware();
// const socketMiddleware = createSocketMiddleware();
const store = createStore(
  // mount it on the Store
  rootReducer,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

export {store};
export const persistor = persistStore(store);

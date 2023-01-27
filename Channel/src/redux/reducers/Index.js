import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import { userInfoReducer } from './user/UserInfo';
import { channelsReducer } from './channels/channelsReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfoReducer'],
};

const rootReducer = combineReducers({
  // USER REDUCER
  userInfoReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;

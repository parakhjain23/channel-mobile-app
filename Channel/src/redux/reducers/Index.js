import AsyncStorage from '@react-native-async-storage/async-storage';
import {combineReducers} from 'redux';
import persistReducer from 'redux-persist/es/persistReducer';
import { userInfoReducer } from './user/UserInfo';
import { orgsReducer } from './orgs/GetOrgDetailsReducer';
import {channelsReducer} from './channels/ChannelsReducer';
import { chatReducer } from './chat/ChatReducer';
import { socketReducer } from './socket/SocketReducer';
import { channelsByQueryReducer } from './channels/ChannelsByQueryReducer';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfoReducer','orgsReducer','channelsReducer','chatReducer'],
};

const rootReducer = combineReducers({
  // USER REDUCER
  userInfoReducer,
  orgsReducer,
  channelsReducer,
  chatReducer,
  socketReducer,
  channelsByQueryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export default persistedReducer;

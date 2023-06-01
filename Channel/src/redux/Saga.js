import {all, fork} from 'redux-saga/effects';
import ChannelSaga from './saga/ChannelSaga';
import ChatSaga from './saga/ChatSaga';
import OrgSaga from './saga/OrgSaga';
import SocketSaga from './saga/SocketSaga';
import UserSaga from './saga/UserSaga';

export default function* rootSaga() {
  yield all([
    fork(OrgSaga),
    fork(ChatSaga),
    fork(UserSaga),
    fork(ChannelSaga),
    fork(SocketSaga),
  ]);
}

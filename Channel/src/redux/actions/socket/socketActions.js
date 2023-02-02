import * as SocketActions from '../../SocketEnums';

import SocketService from '../../../utils/SocketService';
import { call, put } from 'redux-saga/effects';
import { createSocket } from '../../../utils/Socket';

export function* createSocketMiddleware() {
  try {
    var socket = yield call(createSocket)
    yield put(SocketCreated(socket))
  } catch (error) {
    console.log('error', error);
  }
}

export function initializeSocket() {
  console.log('in socket actions');
  return {
    type: SocketActions.INITIALIZE_SOCKET,
  };
}

export function SocketCreated(socket){
  return {
    type : 'SOCKET_CREATED',
    socket:socket
  }
}

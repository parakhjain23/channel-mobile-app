import * as SocketActions from '../../SocketEnums';

import SocketService from '../../../utils/SocketService';
import { call, put } from 'redux-saga/effects';
import { createSocket } from '../../../utils/Socket';

export function* createSocketMiddleware({accessToken,orgId}) {
  try {
    var socket = yield call(createSocket,accessToken,orgId)
    SocketService(socket)
  } catch (error) {
    console.log('error is here', error);
  }
}

export function initializeSocket(accessToken,orgId) {
  console.log('in socket actions');
  return {
    type: SocketActions.INITIALIZE_SOCKET,
    accessToken,orgId
  };
}



import * as SocketActions from '../../SocketEnums';

import SocketService from '../../../utils/SocketService';
import { call, put } from 'redux-saga/effects';
import { createSocket } from '../../../utils/Socket';
import { SUBSCRIBE_TO_NOTIFICATIONS } from '../../Enums';

export function* createSocketMiddleware({accessToken,orgId}) {
  try {
    var socket = yield call(createSocket,accessToken,orgId)
    SocketService(socket)
  } catch (error) {
    console.warn('error in createSocketMiddleware', error);
  }
}

export function initializeSocket(accessToken,orgId) {
  return {
    type: SocketActions.INITIALIZE_SOCKET,
    accessToken,orgId
  };
}

export function subscribeToNotifications(accessToken,deviceId) {
  return {
    type: SUBSCRIBE_TO_NOTIFICATIONS,
    accessToken,deviceId
  };
}
export function socketStatus(status) {
  return {
    type: SocketActions.SOCKET_STATUS,
    status
  };
}

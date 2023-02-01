import * as SocketActions from '../../SocketEnums';

import {put, call} from 'redux-saga/effects';
import createSocket, { test } from '../../../utils/Socket';

export function* createSocketMiddleware(){
  try {
    createSocket();
  } catch (error) {
    console.log('error',error);
  }
}

export function initializeSocket(){
    console.log('in socket actions');
    return {
        type: SocketActions.INITIALIZE_SOCKET,
        data:"123"
    }
  }

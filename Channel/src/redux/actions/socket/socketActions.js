import * as SocketActions from '../../SocketEnums';

import {put, call} from 'redux-saga/effects';

export function* createSocketMiddleware(){
  console.log('hello');
}

export function initializeSocket(){
    console.log('in socket actions');
    return {
        type: SocketActions.INITIALIZE_SOCKET,
        data:"123"
    }
  }

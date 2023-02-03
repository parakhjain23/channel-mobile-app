import { connect } from 'react-redux';
import io from 'socket.io-client';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import React from 'react';

export function createSocket(accessToken,orgId){
  const socket = io('wss://api.intospace.io', {
    forceNew: true,
    transports: ['websocket', 'polling'],
    reconnectionAttempts: 10,
  });
  socket.emit(
    'create',
    'authentication',
    {
      strategy: 'jwt',
      accessToken:`${accessToken}`,
      orgId: `${orgId}`,
      product: 'channel',
      deviceType: 'WEB',
    },
    (error, authResult) => {
      console.log('ERROR', error);
    },
  );
  socket.on('connect', () => {
    console.log('Connected');
  });
  socket.on('disconnect', () => {
    console.log('Disconnected');
  });
  return socket;
};

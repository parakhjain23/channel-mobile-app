import { connect } from 'react-redux';
import io from 'socket.io-client';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import React from 'react';

export function createSocket(){
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
      accessToken:'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjcyNDc1MTY1LCJleHAiOjE3MDQwMzI3NjUsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI3MjY2YTYxOC0wZmQ3LTQyNGUtYmY4MC1iYThiNzlhMThkOWYifQ.xHavkj7bniggtDgtqDUsMG522hwyFBOlpNAFDhgYmXo',
      orgId: 'q957w6rtkdinckgbp8vv',
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

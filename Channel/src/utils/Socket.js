import io from 'socket.io-client';
import {initializeSocket} from '../redux/actions/socket/socketActions';
import {store} from '../redux/Store';

const socket = io('wss://api.intospace.io', {
  forceNew: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
});
export function createSocket(accessToken, orgId) {
  if (socket?.connected) {
    socket.close();
    console.log('socket off');
  }
  socket.emit(
    'create',
    'authentication',
    {
      strategy: 'jwt',
      accessToken: accessToken,
      orgId: orgId,
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
}

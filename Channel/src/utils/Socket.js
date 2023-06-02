import io from 'socket.io-client';

let socket = io('wss://api.intospace.io', {
  forceNew: true,
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 10,
});
export function createSocket(accessToken, orgId) {
  if (socket?.connected) {
    socket.disconnect();
    socket = io('wss://api.intospace.io', {
      forceNew: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 20,
    });
  }
  if (accessToken != undefined) {
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
        // console.warn('ERROR', error);
      },
    );
  }
  return socket;
}

export function closeSocket() {
  if (socket.connected) {
    socket.off();
    socket.close();
  }
}

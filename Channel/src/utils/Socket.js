import io from 'socket.io-client';

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
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InBhcmFraGphaW4yMzAxQGdtYWlsLmNvbSIsImlhdCI6MTY3NDEzMDE5MiwiZXhwIjoxNzA1Njg3NzkyLCJhdWQiOiJodHRwczovL3lvdXJkb21haW4uY29tIiwiaXNzIjoiZmVhdGhlcnMiLCJzdWIiOiJRbjA5d2F1ZWxCcHNGTmRPIiwianRpIjoiNzZmYTIwMmYtMTUxOS00ZDhlLWJhZGItMmY3NDBiZTIzZGNkIn0.FWYFEIH2sDBata8pOCMWg74qlNgHujoThUsnylDuGbc',
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

import { connect } from 'react-redux';
import io from 'socket.io-client';
import {addNewMessage} from '../redux/actions/chat/ChatActions';

export function test(){
  console.log('231231232å');
}


const createSocket = async () => {
  console.log('in create socket');
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
  socket.on('chat/message created', data => {
    console.log('jljlkjl');
    // addNewMessageAction(data)
  });
  // return socket;
};
// const mapDispatchToProps = dispatch => {
//   return {
//     addNewMessageAction: data => dispatch(addNewMessage(data)),
//   };
// };
export default createSocket;
// export default connect(mapDispatchToProps)(createSocket);

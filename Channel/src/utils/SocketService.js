import {moveChannelToTop} from '../redux/actions/channels/ChannelsAction';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import {deleteMessageSuccess} from '../redux/actions/chat/DeleteChatAction';
import {store} from '../redux/Store';

const SocketService = socket => {
  socket.on('chat/message created', data => {
    console.log("chat message created",data);
    store.dispatch(addNewMessage(data));
    store.dispatch(moveChannelToTop(data?.teamId));
  });
  socket.on('chat/message patched', data => {
    console.log("someone reply on message",data);
    if (data?.deleted) {
      store.dispatch(deleteMessageSuccess(data));
    }
  });
  socket.on('chat/message updated', data => {
    console.log("A USER updated A MESSAGE",data);
    if (data?.deleted) {
      store.dispatch(deleteMessageSuccess(data));
    }
  });

};
export default SocketService;

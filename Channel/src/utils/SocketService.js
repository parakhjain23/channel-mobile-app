import {moveChannelToTop} from '../redux/actions/channels/ChannelsAction';
import { createNewChannelSuccess } from '../redux/actions/channels/CreateNewChannelAction';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import {deleteMessageSuccess} from '../redux/actions/chat/DeleteChatAction';
import { userInfoReducer } from '../redux/reducers/user/UserInfo';
import {store} from '../redux/Store';

const SocketService = socket => {
  socket.on('chat/message created', data => {
    console.log("chat message created",data);
    store.dispatch(addNewMessage(data));
    store.dispatch(moveChannelToTop(data?.teamId));
  });
  socket.on('chat/message patched', data => {
    console.log('deleted');
    if (data?.deleted) {
      store.dispatch(deleteMessageSuccess(data));
    }
  });
  socket.on('chat/message updated', data => {
    if (data?.deleted) {
      store.dispatch(deleteMessageSuccess(data));
    }
  });

  socket.on('chat/team created',data=>{
    console.log("new team or chat created",data);
    store.dispatch(createNewChannelSuccess(data,store.getState().userInfoReducer?.user?.id))
  })

};
export default SocketService;

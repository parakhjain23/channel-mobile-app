import {moveChannelToTop} from '../redux/actions/channels/ChannelsAction';
import {createNewChannelSuccess} from '../redux/actions/channels/CreateNewChannelAction';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import {deleteMessageSuccess} from '../redux/actions/chat/DeleteChatAction';
import { newUserJoinedAOrg } from '../redux/actions/org/GetAllUsersOfOrg';
import {store} from '../redux/Store';
import { PlayLocalSoundFile } from './Sounds';

const SocketService = socket => {
  socket.on('reconnect', function () {
    createSocket(store.getState()?.userInfoReducer?.accessToken,store.getState()?.orgsReducer?.currentOrgId)
  });
  socket.on('chat/message created', data => {
    console.log("chat message created",data);
    if(data?.senderId != store?.getState()?.userInfoReducer?.user?.id){
      PlayLocalSoundFile()
    }
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

  socket.on('chat/team created', data => {
    console.log('new team or chat created', data);
    store.dispatch(
      createNewChannelSuccess(data, store.getState().userInfoReducer?.user?.id),
    );
  });

  socket.on('orgUser created', data => {
    console.log('new user Joined Org', data);
    store.dispatch(newUserJoinedAOrg(data));
  });
};
export default SocketService;

import {moveChannelToTop} from '../redux/actions/channels/ChannelsAction';
import { closeChannelSuccess } from '../redux/actions/channels/CloseChannelActions';
import {createNewChannelSuccess} from '../redux/actions/channels/CreateNewChannelAction';
import {getChannelByTeamIdStart} from '../redux/actions/channels/GetChannelByTeamId';
import {addNewMessage} from '../redux/actions/chat/ChatActions';
import {deleteMessageSuccess} from '../redux/actions/chat/DeleteChatAction';
import {newUserJoinedAOrg} from '../redux/actions/org/GetAllUsersOfOrg';
import {socketStatus} from '../redux/actions/socket/socketActions';
import {store} from '../redux/Store';
import {handleNotificationFromEvents} from './HandleNotification';
import {createSocket} from './Socket';
import {PlayLocalSoundFile} from './Sounds';

const SocketService = socket => {
  socket.on('reconnect', function () {
    createSocket(
      store.getState()?.userInfoReducer?.accessToken,
      store.getState()?.orgsReducer?.currentOrgId,
    );
  });
  socket.on('connect', () => {
    store.dispatch(socketStatus(true));
  });
  socket.on('disconnect', () => {
    store.dispatch(socketStatus(false));
  });
  socket.on('chat/message created', data => {
    if (
      store.getState().channelsReducer?.teamIdAndTypeMapping[data?.teamId] ==
      undefined
    ) {
      store.dispatch(
        getChannelByTeamIdStart(
          store?.getState()?.userInfoReducer?.accessToken,
          data?.teamId,
          store?.getState()?.userInfoReducer?.user?.id,
        ),
      );
    }
    var newData = data;
    if (!('isActivity' in newData)) {
      newData.isActivity = false;
    }
    store.dispatch(addNewMessage(newData,store?.getState()?.userInfoReducer?.user?.id));
    store.dispatch(moveChannelToTop([newData?.teamId],newData?.senderId,store?.getState()?.userInfoReducer?.user?.id));
    if (newData?.senderId != store?.getState()?.userInfoReducer?.user?.id) {
      PlayLocalSoundFile();
      if (
        newData?.teamId != store.getState().channelsReducer?.activeChannelTeamId
      ) {
        handleNotificationFromEvents(
          newData,
          store?.getState()?.orgsReducer?.userIdAndDisplayNameMapping,
        );
      }
    }
  });
  socket.on('chat/message patched', data => {
    if (data?.deleted) {
      store.dispatch(deleteMessageSuccess(data));
    }
  });

  socket.on('chat/team updated', data => {
    if (data?.isArchived) {
      store.dispatch(closeChannelSuccess(data?._id));
    }
  });
  socket.on('chat/team created', data => {
    if(data?.userIds?.includes(store?.getState()?.userInfoReducer?.user?.id)){
      store.dispatch(
        createNewChannelSuccess(data, store.getState().userInfoReducer?.user?.id),
      );
      store.dispatch(moveChannelToTop([data?.teamId]));
    }
  });

  socket.on('orgUser created', data => {
    store.dispatch(newUserJoinedAOrg(data));
  });
};
export default SocketService;

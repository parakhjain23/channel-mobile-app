import { moveChannelToTop } from "../redux/actions/channels/ChannelsAction";
import { addNewMessage } from "../redux/actions/chat/ChatActions";
import { store } from "../redux/Store";

const SocketService=(socket)=>{
    socket.on('chat/message created', data => {
      console.log("NEW MESSAGE",data);
        store.dispatch(addNewMessage(data))
        store.dispatch(moveChannelToTop(data?.teamId))
      });
}
export default SocketService
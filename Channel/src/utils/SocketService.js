import { addNewMessage } from "../redux/actions/chat/ChatActions";
import { store } from "../redux/Store";

const SocketService=(socket)=>{
    socket.on('chat/message created', data => {
      console.log("NEW MESSAGE");
        store.dispatch(addNewMessage(data))
      });
}
export default SocketService
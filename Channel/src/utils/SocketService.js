
const SocketService=(socket)=>{
    socket.on('chat/message created', data => {
        console.log("NEW MESSAGE RECIVED",data);
      });
}
export default SocketService
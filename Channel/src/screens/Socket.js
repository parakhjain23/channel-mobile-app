// const io = require('socket.io-client');
// function websock() {
//   const socket = io('wss://api.intospace.io', {
//     transports: ['websocket'],
//     forceNew: true,
//     reconnectionAttempts: 10,
//   });
//   socket.connect()
//   console.log('inside web socket function=-=-=-');
//   socket.on('serverData', () => {
//     console.log('Socket Connected');
//   });
//   socket.once('connect',()=>{
//     console.log("once connect");
//   })
//   socket.onAny(()=>{
//     console.log("Something happned")
//   })
//   socket.on("reconnect",()=>{
//     console.log("Something happned")
//   })
//   socket.on("reconnect_attempt",()=>{
//     console.log("Something happned")
//   })

//   socket.on('disconnect', () => {
//     console.log('Socket Disconnected');
//   });
// }
// websock();
// import { io } from "socket.io-client";
// const socket = io.connect('wss://api.intospace.io/socket.io/?EIO=3&transport=websocket')
// socket.on("connect", () => {
//     console.log(socket.id); // x8WIv7-mJelg7on_ALbx

//     socket.emit('420["create","authentication",{"strategy":"jwt","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjcyNDc1MTY1LCJleHAiOjE3MDQwMzI3NjUsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI3MjY2YTYxOC0wZmQ3LTQyNGUtYmY4MC1iYThiNzlhMThkOWYifQ.xHavkj7bniggtDgtqDUsMG522hwyFBOlpNAFDhgYmXo","orgId":"q957w6rtkdinckgbp8vv","product":"channel","deviceType":"WEB"},{}] ̰')

//     socket.on('data',(message)=>{
//         console.log(message);
//     })
//   });
// export default socket


import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const WebSocketTest = () => {
  // const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const ws = new WebSocket('wss://api.intospace.io/socket.io/?EIO=3&transport=websocket');

    ws.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.onmessage = async(event) => {
      console.log(await event,"-=-=-=-=");
      setMessage(event.data);
    };

    ws.onerror = (error) => {
      console.error(error);
    };

    ws.addEventListener("message",(data)=>{
      console.log(data);
      ws.send('420["create","authentication",{"strategy":"jwt","accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjcyNDc1MTY1LCJleHAiOjE3MDQwMzI3NjUsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI3MjY2YTYxOC0wZmQ3LTQyNGUtYmY4MC1iYThiNzlhMThkOWYifQ.xHavkj7bniggtDgtqDUsMG522hwyFBOlpNAFDhgYmXo","orgId":"q957w6rtkdinckgbp8vv","product":"channel","deviceType":"WEB"},{}')

    });


    // setSocket(ws);

    // return () => {
    //   ws.close();
    // };
  }, []);

  return (
    <View>
      <Text>{message}</Text>
    </View>
  );
};

export default WebSocketTest;


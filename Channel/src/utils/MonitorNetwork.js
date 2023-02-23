import { useEffect } from "react";
import NetInfo from '@react-native-community/netinfo'
import { networkStatus } from "../redux/actions/network/NetworkActions";
import { connect } from "react-redux";
import { sendLocalMessageApi } from "../api/messages/sendMessageApi";
import { removeLocalMessageFromState } from "../redux/actions/channels/LocalMessagesToSendOnNetActiveAction";
const MonitorNetwork=({IsNetConnectedAction,networkState,chatState,orgsState,userInfoState,removeFromLocalMessagesStateAction})=>{
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(async state => {
            console.log(state,chatState?.localMessages,"this is data inside monitor network file");
            IsNetConnectedAction(state.isConnected) 
            if(state?.isConnected){
                        for (let key in chatState?.data) {
                          let localMessages = chatState?.data[key]?.localMessages;
                          console.log(localMessages,"this is local mesage array of object");
                          for (let i = 0; i < localMessages?.length; i++) {
                            let message = localMessages[i];
                            console.log(message,"this is message single message");
                            let response = await sendLocalMessageApi(message.content, message.teamId, message.orgId, message.senderId, userInfoState.accessToken, message.parentId);
                            console.log("message sent");
                            await removeFromLocalMessagesStateAction(response);
                          }
                        }
                      }
        });
        return () => {
          unsubscribe()
        }
      },[])
      return null
}
const mapStateToProps =state=>({
    networkState : state.networkReducer,
    chatState : state.chatReducer,
    orgsState : state.orgsReducer,
    userInfoState : state.userInfoReducer
})
const mapDispatchToProps = dispatch=>{
    return{
        IsNetConnectedAction :(data)=>dispatch(networkStatus(data)),
        removeFromLocalMessagesStateAction:(data)=>dispatch(removeLocalMessageFromState(data))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(MonitorNetwork)
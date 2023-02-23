import React, { useEffect, useState} from 'react';
import { connect, useDispatch } from 'react-redux';
import { removeLocalMessageFromState } from '../redux/actions/channels/LocalMessagesToSendOnNetActiveAction';
import { networkStatus } from '../redux/actions/network/NetworkActions';
import { initializeSocket } from '../redux/actions/socket/socketActions';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWraper';
import AuthNavigation from './AuthNavigation';
import NetInfo from '@react-native-community/netinfo'
import { sendLocalMessageApi } from '../api/messages/sendMessageApi';

const StoreAppWrapper = ({IsNetConnectedAction,networkState,chatState,orgsState,userInfoState,removeFromLocalMessagesStateAction}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    if(userInfoState?.accessToken){
      dispatch(
        initializeSocket(userInfoState?.accessToken, orgsState?.currentOrgId),
      );
    }
  }, [userInfoState?.accessToken, orgsState?.currentOrgId]);
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(async state => {
  //       console.log(state.isConnected,"=-=-=-this is data inside \\\\\\\\\\\\\\\\\ network file");
  //       IsNetConnectedAction(state.isConnected)
  //       // if(state?.isConnected && chatState?.localMessages?.length > 0){
  //       //     chatState?.localMessages?.map(async item=>{
  //       //         console.log(item);
  //       //         var response = await sendLocalMessageApi(item?.content,item?.teamId,orgsState?.currentOrgId,item?.senderId,userInfoState?.accessToken,item?.parentId)
  //       //         await removeFromLocalMessagesStateAction(response)
  //       //     })
  //       // }
  //       if(state?.isConnected){
  //         for (let key in chatState?.data) {
  //           let localMessages = chatState?.data[key]?.localMessages;
  //           console.log(localMessages,"this is local mesage array of object");
  //           for (let i = 0; i < localMessages.length; i++) {
  //             let message = localMessages[i];
  //             console.log(message,"this is message single message");
  //             let response = await sendLocalMessageApi(message.content, message.teamId, message.orgId, message.senderId, userInfoState.accessToken, message.parentId);
  //             console.log("message sent");
  //             await removeFromLocalMessagesStateAction(response);
  //           }
  //         }
  //       }
  //   });
  //   return () => {
  //     unsubscribe()
  //   }
  // },[])
  return showSplashScreen ? (
    <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AuthNavigation />
  );
};
const mapStateToProps = state => ({
  networkState : state.networkReducer,
  chatState : state.chatReducer,
  orgsState : state.orgsReducer,
  userInfoState : state.userInfoReducer
});
const mapDispatchToProps = dispatch=>{
  return{
      IsNetConnectedAction :(data)=>dispatch(networkStatus(data)),
      removeFromLocalMessagesStateAction:(data)=>dispatch(removeLocalMessageFromState(data))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(StoreAppWrapper);

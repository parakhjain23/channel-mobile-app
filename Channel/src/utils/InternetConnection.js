import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {sendGlobalMessageApi} from '../api/messages/sendMessageApi';
import {networkStatus} from '../redux/actions/network/NetworkActions';
const InternetConnection = ({networkState, chatState, socketState}) => {
  useEffect(() => {
    console.log('inside useeffect');
    if (networkState?.isInternetConnected && socketState?.isSocketConnected) {
      console.log('inside if');
      Object.keys(chatState?.data)?.map(async teamId => {
        console.log(chatState?.data[teamId]?.globalMessagesToSend,'=-=-=-=-=');
        while (chatState?.data[teamId]?.globalMessagesToSend?.length) {
          await sendGlobalMessageApi(
            chatState?.data[teamId]?.globalMessagesToSend?.shift(),
          );
        }
      });
    }
  }, [networkState?.isInternetConnected,socketState?.isSocketConnected]);

  return null;
};
const mapStateToProps = state => ({
  networkState: state.networkReducer,
  chatState: state.chatReducer,
  socketState: state.socketReducer,
});
export default connect(mapStateToProps)(InternetConnection);

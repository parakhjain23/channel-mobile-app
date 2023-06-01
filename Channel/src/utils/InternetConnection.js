import NetInfo from '@react-native-community/netinfo';
import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {sendGlobalMessageApi} from '../api/messages/sendMessageApi';
import {networkStatus} from '../redux/actions/network/NetworkActions';
const InternetConnection = ({
  networkState,
  chatState,
  socketState,
  networkStatusAction,
}) => {
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state?.isConnected) {
        networkStatusAction(true);
      } else {
        networkStatusAction(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  useEffect(() => {
    if (socketState?.isSocketConnected) {
      Object.keys(chatState?.data)?.map(async teamId => {
        while (chatState?.data[teamId]?.globalMessagesToSend?.length) {
          await sendGlobalMessageApi(
            chatState?.data[teamId]?.globalMessagesToSend?.shift(),
          );
        }
      });
    }
  }, [networkState?.isInternetConnected, socketState?.isSocketConnected]);

  return null;
};
const mapStateToProps = state => ({
  networkState: state.networkReducer,
  chatState: state.chatReducer,
  socketState: state.socketReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    networkStatusAction: data => dispatch(networkStatus(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(InternetConnection);

import React, { useEffect, useState } from 'react';
import {Button, Image, Linking, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { getChannelsStart } from '../../redux/actions/channels/ChannelsAction';
import { saveUserToken } from '../../redux/actions/user/userAction';

const ChannelsScreen = (props) => {
    useEffect(() => {
        if(props.channelsState.channels == []){
            props.fetchChannelsAction(props.channelsState.accessToken,props.channelsState.orgId)
        }
    })
    
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')} />
      <Button
        title="channel screen"
      />
    </View>
  );
};
const mapStateToProps = state => ({
  channelsState: state.channelsReducer
});
const mapDispatchToProps = dispatch =>{
  return {
    fetchChannelsAction :(token,orgId)=> dispatch(getChannelsStart(token,orgId))
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(ChannelsScreen);
import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { getChatsReset } from '../../redux/actions/chat/ChatActions';
import { websock } from '../Socket';

const SplashScreen = ({setShowSplashScreen,fetchChatResetAction}) => {
  useEffect(() => {
    setTimeout(() => {
      // websock()
      fetchChatResetAction()
      setShowSplashScreen(false);
    }, 1000);
  });
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')}/>
      <Text style={{textAlign:'center'}}>Channel by Space</Text>
    </View>
  );
};
const mapDispatchToProps = dispatch => {
  return {
    fetchChatResetAction: () => dispatch(getChatsReset())
  }
}
export default connect(null,mapDispatchToProps)(SplashScreen);

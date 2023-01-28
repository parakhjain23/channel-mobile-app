import React, { useEffect, useState } from 'react';
import {Button, Image, Linking, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { getChannelsStart } from '../../redux/actions/channels/ChannelsAction';
import { getOrgDetails, getOrgDetailsStart } from '../../redux/actions/org/GetOrgDetailsAction';
import { saveUserToken } from '../../redux/actions/user/userAction';

const LoginScreen = (props) => {
  const [token,setToken] = useState( props?.route?.params?.token);
  useEffect(()=>{
    setToken(props?.route?.params?.token)
  },[props?.route?.params?.token])
  useEffect(()=>{
    if(token!=undefined){
      props.saveUserTokenAction(props?.route?.params?.token,props?.route?.params?.org);
      props.getOrgDetailsAction(props?.route?.params?.token);
    }
  },[token])
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')} />
      <Button
        title="Login Via Space"
        onPress={() =>
          Linking.openURL(
            'https://auth.intospace.io?redirect_to=channel://&skipURLProtocol=true',
          )
        }
      />
    </View>
  );
};
const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
});
const mapDispatchToProps = dispatch =>{
  return {
    saveUserTokenAction :(token,orgId)=> dispatch(saveUserToken(token,orgId)),
    getOrgDetailsAction: (token) => dispatch(getOrgDetailsStart(token)),
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(LoginScreen);
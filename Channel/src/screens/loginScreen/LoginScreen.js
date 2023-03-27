import React, { useEffect, useState } from 'react';
import {Button, Image, Linking, Platform, Text, View} from 'react-native';
import { connect } from 'react-redux';
import { getChannelsStart } from '../../redux/actions/channels/ChannelsAction';
import { getOrgDetails, getOrgDetailsStart } from '../../redux/actions/org/GetOrgDetailsAction';
import { saveUserToken } from '../../redux/actions/user/userAction';
import { InAppBrowser } from 'react-native-inappbrowser-reborn'


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
  Platform.OS=='ios' && useEffect(() => {
    Linking.addEventListener('url',handleDeepLink)
    return () => {
      Linking.remove('url');
    };
  }, [])
  const styling = Platform.OS =='ios'? {animated:true} : {animation:{startEnter:'slide_in_left'}} 
  const handleDeepLink =(event)=>{
    InAppBrowser.close()
  }
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')} />
      <Button
        title="Login Via Space"
        onPress={async () =>
          // Linking.openURL(
          //   'https://auth.intospace.io?redirect_to=walkover.space.chat://&skipURLProtocol=true',
          // )
         await InAppBrowser.open('https://auth.intospace.io?redirect_to=channel://&skipURLProtocol=true',styling)
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
import React from 'react';
import {Button, Image, Linking, Text, View} from 'react-native';
import { connect } from 'react-redux';

const LoginScreen = ({props}) => {
  console.log(props?.route?.params?.org,"THIS IS ORG ID=-=-=-=-=-=");
  console.log(props?.route?.params?.token,"THIS IS TOKENNNNNN ID=-=-=-=-=-=");
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
export default connect(mapStateToProps)(LoginScreen);
import React, {useState} from 'react';
import {Button, Image, Linking, Text, View} from 'react-native';
import WebView from 'react-native-webview';

const LoginScreen = props => {
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
export default LoginScreen;
//https://auth.intospace.io/?redirect_to=channel:%2F%2Fhello&skipURLProtocol=true

// https://channel//hello/login?org=q957w6rtkdinckgbp8vv&token=eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjc0NTQyNDE5LCJleHAiOjE3MDYxMDAwMTksImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI2YmE3ZGRlNC0yMTIxLTRiZGMtYTAyMy0wZTczN2M1M2RkOGQifQ._8ay1HoqXbNNMhMp8mPK1ATrFTYvdmTQtXsE7JfFrZo

// channel://login/?org=f25h33pu1cs5xyupm28v&token=eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjc0NTQyNDE5LCJleHAiOjE3MDYxMDAwMTksImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI2YmE3ZGRlNC0yMTIxLTRiZGMtYTAyMy0wZTczN2M1M2RkOGQifQ._8ay1HoqXbNNMhMp8mPK1ATrFTYvdmTQtXsE7JfFrZo
//https://auth.intospace.io/?redirect_to=channel:%2F%2Flogin&skipURLProtocol=true

//https://channel/login/login?org=fasldkfjasdfasdf&token=fasdfasdfasdf

//https://channel///login?org
// channel://login?org=dfasdfa

// login/login?org=fasdfasdfas&token=asdfasdfasdf

//      channel://login?org=afsdfasdfasd&token=asdfasdfasdf

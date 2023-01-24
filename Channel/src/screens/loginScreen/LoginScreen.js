import React from 'react'
import { Button, Image, Linking, Text, View } from 'react-native';
import WebView from 'react-native-webview';





const openWeb =()=>{
    console.log("inside openWEb");
    return <View style={{flex:1}}>
        <WebView 
        source={{uri:'https://auth.intospace.io?redirect_to=channel://hello&skipURLProtocol=true'}}
    /> 
    </View>
}

const LoginScreen  = ({route}) => {
    const {data}=route.params || {}
    console.log(data,"THIS IS DATA  ");
    console.log('Inside Login Screen');
    return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Image source={require('../../assests/images/appIcon/icon-96x96.png')}/>
            <Button title='Login Via Space' onPress={openWeb}/>
        </View>
        // <Text>helloo</Text>
    );
}
export default LoginScreen;
// https://channel//hello/login?org=q957w6rtkdinckgbp8vv&token=eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjc0NTQyNDE5LCJleHAiOjE3MDYxMDAwMTksImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI2YmE3ZGRlNC0yMTIxLTRiZGMtYTAyMy0wZTczN2M1M2RkOGQifQ._8ay1HoqXbNNMhMp8mPK1ATrFTYvdmTQtXsE7JfFrZo
//https://auth.intospace.io/?redirect_to=channel:%2F%2Fhello&skipURLProtocol=true
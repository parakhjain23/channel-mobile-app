import React from 'react'
import { Button, Image, Linking, Text, View } from 'react-native';
import WebView from 'react-native-webview';





const openWeb =()=>{
    console.log("inside openWEb");
    return <View>
        <WebView 
        source={{uri:'https://auth.intospace.io?redirect_to=channel://hello&skipURLProtocol=true'}}
    />
    </View>
}

const LoginScreen  = () => {
    console.log('Inside Login Screen');
    return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Image source={require('../../assests/images/appIcon/icon-96x96.png')}/>
            <Button title='Login Via Space' onPress={()=><WebView source={{uri:'https://auth.intospace.io?redirect_to=channel://hello&skipURLProtocol=true'}} />}/>
        </View>
        // <Text>helloo</Text>
    );
}
export default LoginScreen;
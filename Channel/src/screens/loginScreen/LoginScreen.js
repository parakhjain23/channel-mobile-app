import React from 'react'
import { Button, Image, Linking, Text, View } from 'react-native';

const LoginScreen  = () => {
    console.log('Inside Login Screen');
    return (
        <View style={{flex:1, justifyContent:'center',alignItems:'center'}}>
            <Image source={require('../../assests/images/appIcon/icon-96x96.png')}/>
            <Button title='Login Via Space' onPress={()=>Linking.openURL('https://auth.intospace.io')}/>
        </View>
        // <Text>helloo</Text>
    );
}
export default LoginScreen;
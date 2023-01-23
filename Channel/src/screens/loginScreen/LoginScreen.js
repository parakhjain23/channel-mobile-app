import React from 'react'
import { Button, Linking, Text } from 'react-native';

const LoginScreen  = () => {
    console.log('Inside Login Screen');
    return (
        <Button title='Login Via Space' onPress={()=>Linking.openURL('https://auth.intospace.io')}/>
        // <Text>helloo</Text>
    );
}
export default LoginScreen;
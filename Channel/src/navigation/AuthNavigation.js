import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import { ActivityIndicator } from 'react-native';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';

const Linking={
    prefixes: ['channel://'],
    config: {
      // initialRouteName: 'Login',
      screens: {
        Login: {
          path: 'login'
        },
        Hello: {
          path: 'hello'
        }
      }
    }
}

const AuthNavigation = () => {
    console.log('Inside auth navigation');
//   const scheme = useColorScheme();
  return <NavigationContainer linking={Linking} fallback={<ActivityIndicator color={'red'} size={'large'}/>}>
    <ProtectedNavigation />
  </NavigationContainer>
};

export default AuthNavigation;
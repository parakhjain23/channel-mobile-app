import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import {ActivityIndicator} from 'react-native';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';

const linking = {
  prefixes: ['channel://'],
  initialRouteName: 'Login',
  config: {
    screens: {
      Login: {
        path: 'login',
        parse:{
          props: (props)=>props
        }
      },
      Hello: {
        path: 'hello',
      },
      // Login: "*"
    },
  },
};

const AuthNavigation = () => {
  return (
    <NavigationContainer
      linking={linking}
      fallback={<ActivityIndicator color={'red'} size={'large'} />}>
        <ProtectedNavigation/>
    </NavigationContainer>
  );
};

export default AuthNavigation;

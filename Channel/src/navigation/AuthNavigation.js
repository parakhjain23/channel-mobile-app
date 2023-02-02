import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import { createSocket } from '../utils/Socket';
import { connect } from 'react-redux';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';

const linking = {
  prefixes: ['channel://'],
  initialRouteName: 'Login',
  config: {
    screens: {
      Login: {
        path: 'login',
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
      linking={linking}>
        <ProtectedNavigation/>
    </NavigationContainer>
  );
};

export default AuthNavigation;

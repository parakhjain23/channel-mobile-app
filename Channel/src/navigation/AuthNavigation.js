import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';

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

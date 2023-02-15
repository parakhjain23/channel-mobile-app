import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import { navigationRef } from './RootNavigation';

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
    <NavigationContainer ref={navigationRef}
      linking={linking}>
        <ProtectedNavigation/>
    </NavigationContainer>
  );
};

export default AuthNavigation;

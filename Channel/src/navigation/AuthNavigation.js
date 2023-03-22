import React, {useEffect} from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import {navigationRef} from './RootNavigation';
import { useColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME } from '../theme/Theme';

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
  const scheme = useColorScheme();
  return (
    <NavigationContainer ref={navigationRef} linking={linking} theme={scheme=="dark" ? DARK_THEME: LIGHT_THEME}>
      <ProtectedNavigation />
    </NavigationContainer>
  );
};

export default AuthNavigation;

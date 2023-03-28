import React, {useEffect, useState} from 'react';
import {DarkTheme, DefaultTheme, NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import {navigationRef} from './RootNavigation';
import { Linking, useColorScheme } from 'react-native';
import { DARK_THEME, LIGHT_THEME } from '../theme/Theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const linking = {
  prefixes: ['channel://','channel','walkover.space.chat'],
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
  const [scheme,setScheme] = useState('light');
  useEffect(() => {
    async function fetchTheme() {
      const theme = await AsyncStorage.getItem('theme');
      if(theme!=null){
        setScheme(theme)
      }
      else{
        setScheme(useColorScheme());
      }
    }
    fetchTheme();
  }, []);
  return (
    <NavigationContainer ref={navigationRef} linking={linking} theme={scheme=="dark" ? DARK_THEME: LIGHT_THEME}>
      <ProtectedNavigation setScheme={setScheme}/>
    </NavigationContainer>
  );
};

export default AuthNavigation;

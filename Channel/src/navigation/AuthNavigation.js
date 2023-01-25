import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import {ActivityIndicator} from 'react-native';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import OrgScreen from '../screens/orgScreen/OrgScreen';

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
      linking={linking}
      fallback={<ActivityIndicator color={'red'} size={'large'} />}>
        <ProtectedNavigation/>
    </NavigationContainer>
  );
};

export default AuthNavigation;

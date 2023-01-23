import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';

const AuthNavigation = () => {
    console.log('Inside auth navigation');
//   const scheme = useColorScheme();
  return <NavigationContainer>
    <ProtectedNavigation />
  </NavigationContainer>
};

export default AuthNavigation;
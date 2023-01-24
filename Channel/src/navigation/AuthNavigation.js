import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import ProtectedNavigation from './ProtectedNavigation';
import { ActivityIndicator } from 'react-native';
// import { StatusBar, useColorScheme } from 'react-native';
// import { DARK_THEME, LIGHT_THEME } from '../constant/styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import OrgScreen from '../screens/orgScreen/OrgScreen';


const linking = {
  prefixes: ['channel://'],
  config: {
    screens: {
      Login: {
        path: 'login/:data'
      },
      Hello: {
        path: 'hello/:data'
      },
    }
  }
};

const AuthNavigation = () => {
  const Stack = createNativeStackNavigator();
    console.log('Inside auth navigation');
//   const scheme = useColorScheme();
  return <NavigationContainer linking={linking} fallback={<ActivityIndicator color={'red'} size={'large'}/>}>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
        <Stack.Screen name="Hello" component={OrgScreen} options={{headerShown:false}} />
    </Stack.Navigator>
  </NavigationContainer>
};

export default AuthNavigation;

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import { connect } from 'react-redux';
// import {useNavigation, useTheme} from '@react-navigation/native';

const ProtectedNavigation = () => {
    console.log('Inside Protected Navigation');
  const Stack = createNativeStackNavigator();
//   const navigate = useNavigation();
  //   const {colors} = useTheme();
  //   const getShopingCartHeader = {
  //     animationDuration: 0,
  //     statusBarColor: 'transparent',
  //     headerTintColor: colors.color,
  //     headerStyle: {
  //       color: colors.color,
  //       backgroundColor: colors.primaryColor,
  //     },
  //     statusBarTranslucent:true
  //   };
  return (
    // <Stack.Navigator>
    //     <Stack.Screen name="Login" component={LoginScreen} options={{headerShown:true}} />
    // </Stack.Navigator>
    <></>
  )
};

const mapStateToProps = (state) => ({
    userInfoSate: state.userInfoReducer,
})
export default connect(mapStateToProps)(ProtectedNavigation);

// IMPROVE  : STYLES

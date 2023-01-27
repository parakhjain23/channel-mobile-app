import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import OrgScreen from '../screens/orgScreen/OrgScreen';
import ChannelsScreen from '../screens/channelsScreen/ChannelsScreen';
// import {useNavigation, useTheme} from '@react-navigation/native';

const ProtectedNavigation = ({userInfoSate}) => {
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
  return !userInfoSate?.isSignedIn ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Org">
      <Stack.Screen
        name="Org"
        component={ChannelsScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
});
export default connect(mapStateToProps)(ProtectedNavigation);

// IMPROVE  : STYLES

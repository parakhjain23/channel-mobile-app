import React, { useEffect } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect, useDispatch} from 'react-redux';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import { initializeSocket } from '../redux/actions/socket/socketActions';
import { createSocket } from '../utils/Socket';
import { addNewMessage } from '../redux/actions/chat/ChatActions';
// import {useNavigation, useTheme} from '@react-navigation/native';

const ProtectedNavigation = ({userInfoSate}) => {
  const Stack = createNativeStackNavigator();
  const Drawer = createDrawerNavigator();
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
  const dispatch = useDispatch();
  useEffect(() => {
    if(userInfoSate?.accessToken!=null){
      dispatch(initializeSocket());
    }
  }, [userInfoSate?.accessToken])
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
          component={DrawerNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({route}) => ({
            headerTitle: route?.params?.chatHeaderTitle,
            headerShown: true,
          })}
        />
      </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
  orgsState: state.orgsReducer,
});
export default connect(mapStateToProps)(ProtectedNavigation);

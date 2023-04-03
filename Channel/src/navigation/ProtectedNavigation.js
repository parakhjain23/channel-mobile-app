import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import ExploreChannels from '../screens/channelsScreen/ExploreChannels';
import ContactDetailsPage from '../screens/userProfiles/UserProfiles';
import { useNavigation, useTheme } from '@react-navigation/native';
import { TouchableOpacity,Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ProtectedNavigation = (props) => {
  const Stack = createNativeStackNavigator();
  const {colors} = useTheme();
    const navigate = useNavigation();
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
  const getHeader = {
    headerTintColor: colors.textColor,
    headerStyle: {
      color: colors.textColor,
      backgroundColor: colors.headerColor,
    },
  };
  return !props?.userInfoSate?.isSignedIn ? (
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
        initialParams={{setScheme: props?.setScheme}}
        options={{headerShown: false,...getHeader}}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          headerTitle: route?.params?.chatHeaderTitle,
          headerShown: true,
          ...getHeader,
        headerLeft:()=>(
            <TouchableOpacity style={{paddingVertical:15,paddingRight:30}} onPressIn={()=>navigate.goBack()}>
            <Icon name="arrow-left" size={18} color={colors.textColor}/>
          </TouchableOpacity>
  )})}
      />
      <Stack.Screen
        name="ExploreChannels"
        component={ExploreChannels}
        options={({route}) => ({
          headerTitle: route?.params?.chatHeaderTitle,
          headerShown: true,
          ...getHeader
        })}
      />
      <Stack.Screen
        name="UserProfiles"
        component={ContactDetailsPage}
        options={({route}) => ({
          headerTitle: route?.params?.displayName + " Profile",
          headerShown: true,
          ...getHeader
        })}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoSate: state.userInfoReducer,
});
export default connect(mapStateToProps)(ProtectedNavigation);

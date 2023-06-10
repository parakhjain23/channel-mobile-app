import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import ExploreChannels from '../screens/channelsScreen/ExploreChannels';
import ContactDetailsPage from '../screens/userProfiles/UserProfiles';
import {useTheme} from '@react-navigation/native';
import {
  TouchableOpacity,
  Text,
  Platform,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigation/RootNavigation';
import {fetchSearchedUserProfileStart} from '../redux/actions/user/searchUserProfileActions';
import {ms} from 'react-native-size-matters';
import SelectWorkSpaceScreen from '../screens/selectWorkSpaceScreen/SelectWorkSpaceScreen';
import IpadScreen from '../screens/ipadScreen/IpadScreen';
import {DEVICE_TYPES} from '../constants/Constants';
import * as Actions from '../redux/Enums';
import ChannelDetailsScreen from '../screens/channelDetails/ChannelDetails';
import {Header} from '../components/Header';

const ProtectedNavigation = props => {
  const Stack = createNativeStackNavigator();
  const {colors} = useTheme();
  const {width, height} = Dimensions.get('window');
  const isTablet = width >= 600 && height >= 600;
  const isIPad = Platform.OS === 'ios' && Platform.isPad;
  const deviceType = isTablet || isIPad ? DEVICE_TYPES[1] : DEVICE_TYPES[0];

  useEffect(() => {
    props?.setDeviceTypeAction(deviceType);
  }, []);

  const getHeader = {
    headerTintColor: colors.textColor,
    animation: 'none',
    headerStyle: {
      color: colors.textColor,
      backgroundColor: colors.headerColor,
    },
    statusBarColor: 'transparent',
    statusBarTranslucent: true,
    statusBarStyle: colors?.primaryColor == '#ffffff' ? 'dark' : 'light',
  };

  return props?.orgsState?.currentOrgId == null ? (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SelectWorkSpace"
        component={SelectWorkSpaceScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  ) : (
    <Stack.Navigator initialRouteName="Org">
      <Stack.Screen
        name="Org"
        component={DrawerNavigation}
        options={{
          headerShown: false,
          ...getHeader,
        }}
      />
      <Stack.Screen
        name="Ipad"
        component={IpadScreen}
        options={{
          headerShown: true,
          ...getHeader,
        }}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerShown: false,
          ...getHeader,
        }}
      />
      <Stack.Screen
        name="Explore Channels"
        component={ExploreChannels}
        options={({route}) => ({
          headerTitle: route?.params?.chatHeaderTitle,
          headerShown: true,
          ...getHeader,
        })}
      />
      <Stack.Screen
        name="UserProfiles"
        component={ContactDetailsPage}
        options={({route}) => ({
          headerTitle: route?.params?.displayName + ' Profile',
          headerShown: true,
          ...getHeader,
        })}
      />
      <Stack.Screen
        name="ChannelDetails"
        component={ChannelDetailsScreen}
        options={({route}) => ({
          // header: () => <CustomHeader route={route} />,
          headerTitle: route?.params?.channelName,
          headerShown: true,
          ...getHeader,
        })}
      />
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
  orgsState: state.orgsReducer,
  appInfoState: state.appInfoReduer,
});
const mapDispatchToProps = dispatch => {
  return {
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
    setDeviceTypeAction: deviceType =>
      dispatch({type: Actions.SET_DEVICE_TYPE, deviceType: deviceType}),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtectedNavigation);

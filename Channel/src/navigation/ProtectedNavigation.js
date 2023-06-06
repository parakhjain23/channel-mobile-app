import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import ExploreChannels from '../screens/channelsScreen/ExploreChannels';
import ContactDetailsPage from '../screens/userProfiles/UserProfiles';
import {useTheme} from '@react-navigation/native';
import {TouchableOpacity, Text, Platform, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigation/RootNavigation';
import {fetchSearchedUserProfileStart} from '../redux/actions/user/searchUserProfileActions';
import {ms} from 'react-native-size-matters';
import SelectWorkSpaceScreen from '../screens/selectWorkSpaceScreen/SelectWorkSpaceScreen';
import IpadScreen from '../screens/ipadScreen/IpadScreen';
import {DEVICE_TYPES} from '../constants/Constants';
import * as Actions from '../redux/Enums';
import ChannelDetailsScreen from '../screens/channelDetails/ChannelDetails';
import FastImage from 'react-native-fast-image';

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
  const PLATFORM = Platform.OS == 'android' ? 'android' : 'ios';
  const CustomHeaderTitle = ({route}) => {
    return route?.params?.channelType === 'DIRECT_MESSAGE' ? (
      <TouchableOpacity
        onPress={async () => {
          RootNavigation.navigate('UserProfiles', {
            displayName: route?.params?.chatHeaderTitle,
            userId: route?.params?.userId,
          });
          await props?.searchUserProfileAction(
            route?.params?.userId,
            props?.userInfoState?.accessToken,
          );
        }}
        style={{
          // backgroundColor: 'red',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: PLATFORM == 'android' ? null : 20,
          paddingRight: PLATFORM == 'android' ? 70 : null,
        }}>
        <FastImage
          source={{
            uri: props?.orgsState?.userIdAndImageUrlMapping[
              route?.params?.userId
            ],
          }}
          style={{
            height: 30,
            width: 30,
            borderRadius: 50,
            marginRight: 8,
          }}
        />
        <Text
          style={{
            color: colors?.textColor,
            fontSize: 12,
            fontWeight: '600',
            maxWidth: PLATFORM == 'android' ? '100%' : null,
          }}
          numberOfLines={1}>
          {route?.params?.chatHeaderTitle}
        </Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        onPress={() => {
          RootNavigation.navigate('ChannelDetails', {
            channelName: route.params.chatHeaderTitle,
            teamId: route?.params?.teamId,
          });
        }}
        style={{
          paddingHorizontal: PLATFORM == 'android' ? null : 10,
          paddingRight: PLATFORM == 'android' ? 50 : null,
        }}>
        <Text
          style={{
            color: colors?.textColor,
            fontSize: 20,
            fontWeight: '600',
            maxWidth: Platform.OS == 'android' ? '100%' : null,
          }}
          numberOfLines={1}>
          {route?.params?.chatHeaderTitle?.length > 50
            ? route?.params?.chatHeaderTitle?.slice(0, 20) + '...'
            : route?.params?.chatHeaderTitle}
        </Text>
      </TouchableOpacity>
    );
  };
  const getHeader = {
    headerTintColor: colors.textColor,
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
        options={({route}) => ({
          headerTitle: () => {
            return <CustomHeaderTitle route={route} />;
          },
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingRight: Platform.OS === 'ios' ? ms(50) : ms(30),
                marginLeft: -18,
              }}
              onPressIn={() => RootNavigation.goBack()}>
              <Icon
                name="chevron-left"
                size={18}
                color={colors.textColor}
                style={{paddingLeft: 10}}
              />
            </TouchableOpacity>
          ),
          ...getHeader,
        })}
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

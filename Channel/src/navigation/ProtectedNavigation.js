import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import ExploreChannels from '../screens/channelsScreen/ExploreChannels';
import ContactDetailsPage from '../screens/userProfiles/UserProfiles';
import {useNavigation, useTheme} from '@react-navigation/native';
import {TouchableOpacity, Text, View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigation/RootNavigation';
import {fetchSearchedUserProfileStart} from '../redux/actions/user/searchUserProfileActions';
import {store} from '../redux/Store';
import {ms} from 'react-native-size-matters';

const ProtectedNavigation = props => {
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
  return !props?.userInfoState?.isSignedIn ? (
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
        options={{headerShown: false, ...getHeader}}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          headerTitle: () => {
            return route?.params?.channelType === 'DIRECT_MESSAGE' ? (
              <TouchableOpacity
                onPress={async () => {
                  RootNavigation.navigate('UserProfiles', {
                    displayName: route?.params?.chatHeaderTitle,
                  });
                  await props?.searchUserProfileAction(
                    route?.params?.userId,
                    props?.userInfoState?.accessToken,
                  );
                }}>
                <Text
                  style={{
                    color: colors?.textColor,
                    fontSize: ms(16),
                    fontWeight: '600',
                  }}>
                  {route?.params?.chatHeaderTitle}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text
                style={{
                  color: colors?.textColor,
                  fontSize: ms(16),
                  fontWeight: '600',
                }}>
                {route?.params?.chatHeaderTitle}
              </Text>
            );
          },
          headerShown: true,
          ...getHeader,
          headerLeft: () => (
            <TouchableOpacity
              style={{
                paddingVertical: 15,
                paddingRight: Platform.OS == 'ios' ? 70 : 30,
              }}
              onPressIn={() => RootNavigation.goBack()}>
              <Icon name="arrow-left" size={18} color={colors.textColor} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="ExploreChannels"
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
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProtectedNavigation);

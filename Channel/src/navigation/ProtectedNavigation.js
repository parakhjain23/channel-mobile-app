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
import {ms} from 'react-native-size-matters';
import SelectWorkSpaceScreen from '../screens/selectWorkSpaceScreen/SelectWorkSpaceScreen';

const ProtectedNavigation = props => {
  const Stack = createNativeStackNavigator();
  const {colors} = useTheme();

  const CustomHeaderTitle = ({route}) => {
    console.log(route,"-=-=-=-=-=-");
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
            fontSize: ms(20),
            fontWeight: '600',
          }} numberOfLines={1} ellipsizeMode='tail'>
          {route?.params?.chatHeaderTitle}
        </Text>
      </TouchableOpacity>
    ) : (
        <Text
          style={{
            color: colors?.textColor,
            fontSize: ms(20),
            fontWeight: '600',
            maxWidth:'90%'
          }} numberOfLines={1} ellipsizeMode='tail'>
          {route?.params?.chatHeaderTitle}
        </Text>
    );
  };
  const getHeader = {
    headerTintColor: colors.textColor,
    headerStyle: {
      color: colors.textColor,
      backgroundColor: colors.headerColor,
    },
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
        initialParams={{setScheme: props?.setScheme}}
        options={{headerShown: false, ...getHeader}}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
        options={({route}) => ({
          headerTitle: () => {
            return <CustomHeaderTitle route={route} />;
          },
          headerShown: true,
          headerBackVisible: false,
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
    </Stack.Navigator>
  );
};

const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  channelsState: state.channelsReducer,
  orgsState: state.orgsReducer,
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

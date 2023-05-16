import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen/LoginScreen';
import {connect} from 'react-redux';
import DrawerNavigation from './DrawerNavigation';
import ChatScreen from '../screens/chatScreen/ChatScreen';
import ExploreChannels from '../screens/channelsScreen/ExploreChannels';
import ContactDetailsPage from '../screens/userProfiles/UserProfiles';
import {useTheme} from '@react-navigation/native';
import {TouchableOpacity, Text, Platform, View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as RootNavigation from '../navigation/RootNavigation';
import {fetchSearchedUserProfileStart} from '../redux/actions/user/searchUserProfileActions';
import {ms} from 'react-native-size-matters';
import SelectWorkSpaceScreen from '../screens/selectWorkSpaceScreen/SelectWorkSpaceScreen';

const ProtectedNavigation = props => {
  const Stack = createNativeStackNavigator();
  const {colors} = useTheme();

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
        style={{flexDirection: 'row', flex: 1}}>
        <Text
          style={{
            color: colors?.textColor,
            fontSize: ms(20),
            fontWeight: '600',
            maxWidth: Platform.OS == 'android' ? '90%' : null,
          }}
          numberOfLines={1}
          // ellipsizeMode="tail"
        >
          {route?.params?.chatHeaderTitle}
        </Text>
      </TouchableOpacity>
    ) : (
      <View style={{flexDirection: 'row', flex: 1}}>
        <Text
          style={{
            color: colors?.textColor,
            fontSize: ms(20),
            fontWeight: '600',
            maxWidth: Platform.OS == 'android' ? '90%' : null,
          }}
          numberOfLines={1}
          // ellipsizeMode="tail"
        >
          {route?.params?.chatHeaderTitle}
        </Text>
      </View>
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
                flexDirection: 'column',
                // flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: ms(15),
                paddingRight: Platform.OS === 'ios' ? ms(50) : ms(30),
                marginLeft: -15,
              }}
              onPressIn={() => RootNavigation.goBack()}>
              <Icon
                name="arrow-left"
                size={ms(16)}
                color={colors.textColor}
                style={{paddingLeft: ms(10)}}
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

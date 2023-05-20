import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import * as RootNavigation from '../navigation/RootNavigation';
import {fetchSearchedUserProfileStart} from '../redux/actions/user/searchUserProfileActions';
import {useTheme} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatHeaderForTab = props => {
  const {colors} = useTheme();
  const IconName =
    props?.chatDetailsForTab?.channelType === 'DIRECT_MESSAGE'
      ? 'user'
      : props?.chatDetailsForTab?.channelType === 'PRIVATE'
      ? 'lock'
      : 'hashtag';
  return (
    <View
      style={{
        height: 50,
        justifyContent: 'center',
        borderColor: 'black',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: 'black',
        borderBottomColor: 'black',
        backgroundColor: colors.primaryColor
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
          marginLeft: 20,
        }}
        onPress={async () => {
          props?.chatDetailsForTab.channelType == 'DIRECT_MESSAGE' &&
            (RootNavigation.navigate('UserProfiles', {
              displayName:
                props?.orgsState?.userIdAndDisplayNameMapping[
                  props?.chatDetailsForTab?.userId
                ],
              userId: props?.chatDetailsForTab.userId,
              setChatDetailsForTab: props?.setChatDetailsForTab
            }),
            await props?.searchUserProfileAction(
              props?.chatDetailsForTab?.userId,
              props?.userInfoState?.accessToken,
            ));
        }}>
        <Icon
          name={IconName}
          size={18}
          color={colors?.color}
          style={{marginRight: 10}}
        />
        <Text style={{color: colors?.color, fontSize: 18}}>
          {props?.chatDetailsForTab?.channelType == 'DIRECT_MESSAGE'
            ? props?.orgsState?.userIdAndDisplayNameMapping[
                props?.chatDetailsForTab?.userId
              ]
            : props?.chatDetailsForTab?.searchedChannel
            ? props?.chatDetailsForTab?.channelName
            : props?.channelsState?.teamIdAndNameMapping[
                props?.chatDetailsForTab?.teamId
              ]}
        </Text>
      </TouchableOpacity>
    </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ChatHeaderForTab);

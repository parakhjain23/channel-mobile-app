import {useTheme} from '@react-navigation/native';
import React from 'react';
import {getChatsReset} from '../../redux/actions/chat/ChatActions';

import {
  Text,
  TouchableOpacity,
  View,
  Button,
  TouchableNativeFeedback,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import {s, vs, ms, mvs} from 'react-native-size-matters';
import {resetUnreadCountStart} from '../../redux/actions/channels/ChannelsAction';
import * as RootNavigation from '../../navigation/RootNavigation';

const TouchableItem =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const ChannelCard = ({item, navigation, props, resetUnreadCountAction,resetChatsAction}) => {
  const {colors} = useTheme();
  // console.log(props?.orgsState);
  const Name =
    item?.type == 'DIRECT_MESSAGE'
      ? props?.orgsState?.userIdAndDisplayNameMapping
        ? props?.orgsState?.userIdAndDisplayNameMapping[
            `${
              item.userIds[0] != props?.userInfoState?.user?.id
                ? item.userIds[0]
                : item.userIds[1]
            }`
          ]
        : (props?.orgsState?.userIdAndNameMapping
          ? props?.orgsState?.userIdAndNameMapping[
              `${
                item.userIds[0] != props?.userInfoState?.user?.id
                  ? item.userIds[0]
                  : item.userIds[1]
              }`
            ]
          : 'Loading....')
      : item?.name;
  const iconName = item?.type == 'DIRECT_MESSAGE' ? 'user' : 'hashtag';
  let unread =
    props?.channelsState?.teamIdAndUnreadCountMapping?.[item?._id] > 0 ||
    (props?.channelsState?.highlightChannel[item?._id] != undefined
      ? (unread = props?.channelsState?.highlightChannel[item?._id]
          ? true
          : false)
      : false);
  const onPress = () => {
    resetChatsAction();
    RootNavigation.navigate('Chat', {
      chatHeaderTitle: Name,
      teamId: item?._id,
      channelType: item?.type,
      userId:
        item?.userIds[0] != props?.userInfoState?.user?.id
          ? item?.userIds[0]
          : item?.userIds[1],
    });
    props?.setActiveChannelTeamIdAction(item?._id);
    props?.channelsState?.teamIdAndUnreadCountMapping?.[item?._id] > 0 &&
      resetUnreadCountAction(
        props?.orgsState?.currentOrgId,
        props?.userInfoState?.user?.id,
        item?._id,
        props?.userInfoState?.accessToken,
      );
  };
  return (
    <TouchableItem
      onPress={onPress}
      background={
        Platform.OS === 'android' ? TouchableNativeFeedback.Ripple('#00000033') : null
      }
      activeOpacity={0.8}>
      <View
        style={{
          borderTopWidth: ms(0.7),
          borderTopColor: '#444444',
          minHeight: mvs(60),
          backgroundColor:
            (unread && colors.unreadBackgroundColor) || colors.primaryColor,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: ms(13),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: '80%',
            }}>
            <Icon name={iconName} size={14} color={colors.textColor} />
            <Text
              style={{
                fontSize: ms(16),
                fontWeight: unread ? '700' : '400',
                color: colors.textColor,
              }}>{`  ${Name}`}</Text>
          </View>
          {props?.channelsState?.teamIdAndUnreadCountMapping?.[item?._id] >
            0 && (
            <View
              style={{
                backgroundColor: '#73e1ff',
                paddingHorizontal: ms(5),
                paddingVertical: mvs(2),
                borderRadius: ms(5),
                overflow: 'hidden',
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: ms(11),
                  fontWeight: 'bold',
                  textAlign: 'center',
                  minWidth: ms(15),
                  height: ms(20),
                  lineHeight: ms(20),
                  overflow: 'hidden',
                }}>
                {props?.channelsState.teamIdAndUnreadCountMapping?.[item?._id]}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableItem>
  );
};
const SearchChannelCard = ({
  item,
  navigation,
  props,
  setsearchValue,
  userInfoState,
  searchUserProfileAction,
  orgsState,
}) => {
  const {colors} = useTheme();
  const Name = item?._source?.title;
  const teamId = item?._id?.includes('_')
    ? props?.channelsState?.userIdAndTeamIdMapping[item?._source?.userId]
    : item?._id;
  const iconName = item?._source?.type == 'U' ? 'user' : 'hashtag';
  const onPress = () => {
    if (teamId == undefined) {
      props?.createDmChannelAction(
        props?.userInfoState?.accessToken,
        props?.orgsState?.currentOrgId,
        Name,
        item?._source?.userId,
      );
    }
    setsearchValue('');
    navigation.navigate('Chat', {
      chatHeaderTitle: Name,
      teamId: teamId,
      reciverUserId: item?._source?.userId,
      channelType: item?._source?.type == 'U' ? 'DIRECT_MESSAGE' : 'CHANNEL',
      userId: item?._source?.userId,
    });
  };
  return (
    <TouchableItem onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          borderTopWidth: ms(0.7),
          borderTopColor: '#444444',
          minHeight: mvs(60),
          borderRadius: ms(5),
          height: s(60),
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: ms(13),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: '80%',
            }}>
            <Icon name={iconName} color={colors.textColor} />
            <Text
              style={{
                fontSize: ms(16),
                fontWeight: '400',
                color: colors.textColor,
              }}>{`  ${Name}`}</Text>
          </View>
          {item?._source?.type == 'U' && (
            <View
              style={{
                position: 'absolute',
                right: ms(20),
              }}>
              <Button
                title="Profile"
                onPress={async () => {
                  await searchUserProfileAction(
                    item?._source?.userId,
                    userInfoState?.accessToken,
                  );
                  navigation.navigate('UserProfiles', {
                    displayName:
                      orgsState?.userIdAndDisplayNameMapping[
                        item?._source?.userId
                      ],
                  });
                }}
              />
            </View>
          )}
        </View>
      </View>
    </TouchableItem>
  );
};
const UsersToAddCard = ({item, setUserIds, userIds, setsearchedUser}) => {
  const {colors} = useTheme();
  const Name = item?._source?.type == 'U' && item?._source?.title;
  return (
    <TouchableOpacity
      style={{
        borderWidth: ms(0.4),
        borderColor: 'gray',
        borderRadius: s(3),
        minHeight: s(45),
        margin: s(1),
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={() => {
        setUserIds([...userIds, item?._source?.userId]);
        setsearchedUser('');
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: ms(13),
        }}>
        <Icon name="user" color={colors.textColor} />
        <Text
          style={{
            fontSize: ms(16, 0.5),
            fontWeight: '400',
            color: colors.textColor,
          }}>
          {' '}
          {Name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
  orgsState: state.orgsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
    resetUnreadCountAction: (orgId, userId, teamId, accessToken) =>
      dispatch(resetUnreadCountStart(orgId, userId, teamId, accessToken)),
      resetChatsAction: () => dispatch(getChatsReset() )
  };
};
export const RenderChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ChannelCard),
);
export const RenderSearchChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SearchChannelCard),
);
export const RenderUsersToAdd = React.memo(UsersToAddCard);

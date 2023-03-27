import {useTheme} from '@react-navigation/native';
import React from 'react';
import {Text, TouchableOpacity, View, Button} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import {s, vs, ms, mvs} from 'react-native-size-matters';
import {resetUnreadCountStart} from '../../redux/actions/channels/ChannelsAction';
const ChannelCard = ({item, navigation, props,resetUnreadCountAction}) => {
  const {colors} = useTheme();
  const Name =
    item?.type == 'DIRECT_MESSAGE'
      ? props?.orgsState?.userIdAndNameMapping &&
        props?.orgsState?.userIdAndNameMapping[
          `${
            item.userIds[0] != props?.userInfoState?.user?.id
              ? item.userIds[0]
              : item.userIds[1]
          }`
        ]
      : item?.name;
  const iconName = item?.type == 'DIRECT_MESSAGE' ? 'user' : 'hashtag';
  let unread =
    props?.channelsState?.highlightChannel[item?._id] != undefined
      ? (unread = props?.channelsState?.highlightChannel[item?._id]
          ? true
          : false)
      : false;
  // var nameFontWeight;
  // props?.channelsState?.highlightChannel[item?._id] != undefined
  //   ? (nameFontWeight = props?.channelsState?.highlightChannel[item?._id]
  //       ? '800'
  //       : '400')
  //   : '400';
  return (
    <TouchableOpacity
      style={{
        borderWidth: ms(0.5),
        borderColor: 'gray',
        minHeight: mvs(60),
        backgroundColor:
          (unread && colors.unreadBackgroundColor) || colors.primaryColor,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={() => {
        props?.setActiveChannelTeamIdAction(item?._id);
        props?.channelsState.teamIdAndUnreadCountMapping?.[item?._id] > 0 && resetUnreadCountAction(
          props?.orgsState?.currentOrgId,
          props?.userInfoState?.user?.id,
          item?._id,
          props?.userInfoState?.accessToken,
        );
        navigation.navigate('Chat', {chatHeaderTitle: Name, teamId: item?._id});
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: ms(13),
        }}>
        <View
          style={{flexDirection: 'row', alignItems: 'center', maxWidth: '80%'}}>
          <Icon name={iconName} size={14} color={colors.textColor} />
          <Text>{'  '}</Text>
          <Text
            style={{
              fontSize: ms(16),
              fontWeight: unread ? '600' : '400',
              color: colors.textColor,
            }}>
            {Name}
          </Text>
        </View>
        {props?.channelsState.teamIdAndUnreadCountMapping?.[item?._id] > 0 && (
          <View>
            <Text
              style={{
                color: '#ff6347',
                paddingHorizontal: ms(6),
                paddingVertical: mvs(2),
                borderRadius: ms(1),
              }}>
              New{' '}
              {props?.channelsState.teamIdAndUnreadCountMapping?.[item?._id]}
            </Text>
          </View>
        )}
        {/* {unread && (
          <View>
            <Text
              style={{
                color: '#ff6347',
                paddingHorizontal: ms(6),
                paddingVertical: mvs(2),
                borderRadius: ms(1),
              }}>
              New {props?.channelsState.teamIdAndUnreadCountMapping>0 && props?.channelsState.teamIdAndUnreadCountMapping}
            </Text>
          </View>
        )} */}
      </View>
    </TouchableOpacity>
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
  const Name =
    item?._source?.type == 'U'
      ? item?._source?.title
      : '#' + item?._source?.title;
  const teamId = item?._id?.includes('_')
    ? props?.channelsState?.userIdAndTeamIdMapping[item?._source?.userId]
    : item?._id;
  const iconName = item?._source?.type == 'U' ? 'user' : 'hashtag';
  return (
    <TouchableOpacity
      style={{
        borderWidth: ms(0.5),
        borderColor: 'gray',
        borderRadius: ms(5),
        height: s(60),
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
      onPress={() => {
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
        });
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: ms(13),
        }}>
        <Icon name={iconName} color={colors.textColor} />
        <Text
          style={{
            fontSize: ms(16),
            fontWeight: '400',
            color: colors.textColor,
          }}>
          {' '}
          {Name}
        </Text>
        <View style={{position: 'absolute', left: undefined, right: ms(20)}}>
          {item?._source?.type == 'U' && (
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
              }}></Button>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
const UsersToAddCard = ({item, setUserIds, userIds, setsearchedUser}) => {
  const {colors} = useTheme();
  const Name = item?._source?.type == 'U' && item?._source?.title;
  return (
    item?._source?.type == 'U' && (
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
    )
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
  };
};
export const RenderChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ChannelCard),
);
export const RenderSearchChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SearchChannelCard),
);
export const RenderUsersToAdd = React.memo(UsersToAddCard);

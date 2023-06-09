import {useTheme} from '@react-navigation/native';
import React, {
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  Button,
  TouchableNativeFeedback,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from 'react-redux';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import * as RootNavigation from '../../navigation/RootNavigation';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import {resetUnreadCountStart} from '../../redux/actions/channels/ChannelsAction';
import {closeChannelStart} from '../../redux/actions/channels/CloseChannelActions';
import {AppContext} from '../appProvider/AppProvider';
import {DEVICE_TYPES} from '../../constants/Constants';
import {RightSwipeAction} from './components/RightActionsForChatCard';
import FastImage from 'react-native-fast-image';
import {getChannelByTeamIdStart} from '../../redux/actions/channels/GetChannelByTeamId';

const TouchableItem =
  Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;

const ChannelCard = ({
  item,
  navigation,
  props,
  markAsUnreadAction,
  closeChannelAction,
}) => {
  const {deviceType} = useContext(AppContext);

  const handleListItemPress = (
    teamId,
    channelType,
    userId,
    searchedChannel,
  ) => {
    props?.setChatDetailsForTab({
      teamId: teamId,
      channelType: channelType,
      userId: userId,
      searchedChannel: searchedChannel,
    });
  };

  const {colors} = useTheme();
  const userIdAndDisplayNameMapping =
    props.orgsState?.userIdAndDisplayNameMapping;
  const userIdAndNameMapping = props.orgsState?.userIdAndNameMapping;
  const teamIdAndUnreadCountMapping =
    props.channelsState?.teamIdAndUnreadCountMapping;
  const teamIdAndBadgeCountMapping =
    props?.channelsState?.teamIdAndBadgeCountMapping;
  const highlightChannel = props.channelsState?.highlightChannel;
  const user = props.userInfoState?.user;
  const accessToken = props.userInfoState?.accessToken;
  const currentOrgId = props.orgsState?.currentOrgId;
  const userId =
    item?.userIds[0] !== user?.id ? item?.userIds[0] : item?.userIds[1];
  const swipeableRef = useRef(null);

  const Name =
    item?.type === 'DIRECT_MESSAGE'
      ? userIdAndDisplayNameMapping
        ? userIdAndDisplayNameMapping[userId]
        : userIdAndNameMapping
        ? userIdAndNameMapping[userId]
        : 'Loading...'
      : item?.name;
  const iconName =
    item?.type === 'DIRECT_MESSAGE'
      ? 'user'
      : item?.type === 'PRIVATE'
      ? 'lock'
      : 'hashtag';

  const unread = useMemo(() => {
    const unreadCount = teamIdAndUnreadCountMapping?.[item?._id] || 0;
    const isHighlighted = highlightChannel?.[item?._id];
    return unreadCount > 0 || isHighlighted;
  }, [item?._id, teamIdAndUnreadCountMapping, highlightChannel]);

  const onPress = useCallback(() => {
    if (deviceType === DEVICE_TYPES[1]) {
      handleListItemPress(item?._id, item?.type, userId, false);
    } else {
      RootNavigation.navigate('Chat', {
        chatHeaderTitle: Name,
        teamId: item?._id,
        channelType: item?.type,
        reciverUserId: userId,
        searchedChannel: false,
      });
    }
  }, [
    Name,
    currentOrgId,
    item?._id,
    item?.type,
    teamIdAndUnreadCountMapping,
    user?.id,
    userId,
    accessToken,
    // networkState,
  ]);
  const renderRightActions = useCallback(
    (progress, dragX) => {
      const scale = dragX.interpolate({
        inputRange: [-10, 0],
        outputRange: [1, 0],
        extrapolate: 'clamp',
      });
      return item?.type !== 'PUBLIC' &&
        (props?.channelsState?.teamIdAndUnreadCountMapping[item?._id] > 0 ||
          props?.channelsState?.teamIdAndBadgeCountMapping[item?._id] >
            0) ? null : (
        <RightSwipeAction
          scale={scale}
          swipeableRef={swipeableRef}
          props={props}
          markAsUnreadAction={markAsUnreadAction}
          closeChannelAction={closeChannelAction}
          item={item}
          Name={Name}
        />
      );
    },
    [props, item, swipeableRef, markAsUnreadAction, closeChannelAction, Name],
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: Name,
    });
  }, [Name, navigation]);

  return (
    <GestureHandlerRootView>
      <Swipeable renderRightActions={renderRightActions} ref={swipeableRef}>
        <TouchableItem
          onPress={onPress}
          background={
            Platform.OS === 'android'
              ? TouchableNativeFeedback.Ripple('#00000033')
              : null
          }
          activeOpacity={0.8}>
          <View
            style={{
              borderTopWidth: 0.3,
              borderTopColor: '#B3B3B3',
              backgroundColor: colors.primaryColor,
              width: '100%',
              flexDirection: 'column',
              justifyContent: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 20,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  maxWidth: '85%',
                }}>
                <Icon name={iconName} size={14} color={colors.textColor} />
                <Text>{'  '}</Text>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: unread ? '700' : '400',
                    color: colors.textColor,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="tail">{`${Name}`}</Text>
              </View>
              {teamIdAndUnreadCountMapping?.[item?._id] > 0 ? (
                <View
                  style={{
                    backgroundColor: '#73e1ff',
                    paddingHorizontal: 5,
                    paddingVertical: 2,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 14,
                      fontWeight: 'bold',
                      textAlign: 'center',
                      minWidth: 15,
                      height: 20,
                      lineHeight: 20,
                    }}>
                    {teamIdAndUnreadCountMapping?.[item?._id]}
                  </Text>
                </View>
              ) : (
                teamIdAndBadgeCountMapping?.[item?._id] > 0 && (
                  <View
                    style={{
                      backgroundColor: 'red',
                      borderRadius: 5,
                      minWidth: 20,
                      height: 20,
                    }}></View>
                )
              )}
            </View>
          </View>
        </TouchableItem>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const SearchChannelCard = ({
  item,
  navigation,
  props,
  userInfoState,
  searchUserProfileAction,
  orgsState,
  getChannelByTeamIdAction,
}) => {
  const {deviceType} = useContext(AppContext);
  const {colors} = useTheme();
  const handleListItemPress = (
    teamId,
    channelType,
    userId,
    searchedChannel,
    Name,
  ) => {
    props?.setChatDetailsForTab({
      teamId: teamId,
      channelType: channelType,
      userId: userId,
      searchedChannel: searchedChannel,
      channelName: Name,
    });
  };

  let Name =
    item?._source?.type == 'U'
      ? item?._source?.displayName
      : item?._source?.title;
  if (item?._source?.userId == userInfoState?.user?.id) {
    Name = item?._source?.title + ' (You)';
  }
  const isArchived =
    item?._source?.type == 'T'
      ? item?._source?.isArchived
      : !item?._source?.isEnabled;
  const teamId = item?._id?.includes('_')
    ? props?.channelsState?.userIdAndTeamIdMapping[item?._source?.userId]
    : item?._id;
  const iconName = useMemo(
    () =>
      item?._source?.type === 'U'
        ? 'user'
        : item?._source?.status == 'PUBLIC'
        ? 'hashtag'
        : 'lock',
    [item?._source?.type, item?._source?.status],
  );

  const onPress = useCallback(async () => {
    if (teamId == undefined) {
      await props?.createDmChannelAction(
        props?.userInfoState?.accessToken,
        props?.orgsState?.currentOrgId,
        Name,
        item?._source?.userId,
      );
    }
    if (props?.channelsState?.teamIdAndTypeMapping[teamId] === undefined) {
      await getChannelByTeamIdAction(
        userInfoState.accessToken,
        teamId,
        userInfoState?.user?.id,
      );
    }
    if (deviceType === DEVICE_TYPES[1]) {
      handleListItemPress(
        teamId,
        item?._source?.type == 'U' ? 'DIRECT_MESSAGE' : 'PUBLIC',
        item?._source?.userId,
        true,
        Name,
      );
    } else {
      navigation.navigate('Chat', {
        chatHeaderTitle: Name,
        teamId: teamId,
        reciverUserId: item?._source?.userId,
        channelType: item?._source?.type == 'U' ? 'DIRECT_MESSAGE' : 'CHANNEL',
        userId: item?._source?.userId,
        searchedChannel: true,
      });
    }
  }, [
    teamId,
    props?.channelsState?.userIdAndTeamIdMapping,
    props?.createDmChannelAction,
    item?.type,
    Name,
    orgsState.currentOrgId,
    navigation,
    userInfoState.accessToken,
  ]);
  return (
    <TouchableItem onPress={onPress} activeOpacity={0.8}>
      <View
        style={{
          borderTopWidth: 0.7,
          borderTopColor: '#444444',
          minHeight: 60,
          borderRadius: 5,
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 13,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              maxWidth: item?._source?.type == 'U' ? '80%' : '95%',
            }}>
            {item._source.type != 'T' ? (
              <FastImage
                source={{
                  uri: orgsState?.userIdAndImageUrlMapping[
                    item?._source?.userId
                  ]
                    ? orgsState?.userIdAndImageUrlMapping[item?._source?.userId]
                    : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
                }}
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 50,
                }}
              />
            ) : (
              <Icon name={iconName} color={colors.textColor} />
            )}
            <Text>{'  '}</Text>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '400',
                color: colors.textColor,
                textDecorationLine: isArchived ? 'line-through' : null,
              }}
              numberOfLines={1}
              ellipsizeMode="tail">{`${Name}`}</Text>
          </View>
          {item?._source?.type == 'U' && (
            <View
              style={{
                position: 'absolute',
                right: 20,
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
                    setChatDetailsForTab: props?.setChatDetailsForTab,
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
const UsersToAddCard = ({
  item,
  setUserIds,
  userIds,
  setsearchedUser,
  orgsState,
}) => {
  const {colors} = useTheme();
  const Name = item?._source?.type == 'U' && item?._source?.title;
  return (
    <TouchableOpacity
      style={{
        borderWidth: 0.4,
        borderColor: 'gray',
        borderRadius: 3,
        minHeight: 45,
        margin: 1,
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
          padding: 13,
        }}>
        {/* <Icon name="user" color={colors.textColor} /> */}
        <FastImage
          source={{
            uri: orgsState?.userIdAndImageUrlMapping[item?._source?.userId]
              ? orgsState?.userIdAndImageUrlMapping[item?._source?.userId]
              : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
            priority: FastImage.priority.normal,
          }}
          style={{
            width: 25,
            height: 25,
            borderRadius: 50,
            marginRight: 5,
          }}
        />
        <Text
          style={{
            fontSize: 16,
            fontWeight: '400',
            color: colors.textColor,
            flex: 1,
          }}
          numberOfLines={1}
          ellipsizeMode="tail">
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
    getChannelByTeamIdAction: (accessToken, teamId, userId) =>
      dispatch(getChannelByTeamIdStart(accessToken, teamId, userId)),
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
    markAsUnreadAction: (
      orgId,
      userId,
      teamId,
      accessToken,
      badgeCount,
      unreadCount,
    ) =>
      dispatch(
        resetUnreadCountStart(
          orgId,
          userId,
          teamId,
          accessToken,
          badgeCount,
          unreadCount,
        ),
      ),
    closeChannelAction: (name, teamId, type, accessToken) =>
      dispatch(closeChannelStart(name, teamId, type, accessToken)),
  };
};
export const RenderChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(ChannelCard),
);
export const RenderSearchChannels = React.memo(
  connect(mapStateToProps, mapDispatchToProps)(SearchChannelCard),
);
export const RenderUsersToAdd = React.memo(
  connect(mapStateToProps, null)(UsersToAddCard),
);

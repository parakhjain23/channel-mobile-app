import * as Actions from '../../Enums';

const initialState = {
  channels: [],
  recentChannels: [],
  isLoading: false,
  activeChannelTeamId: null,
  highlightChannel: {},
  userIdAndTeamIdMapping: {},
  teamIdAndNameMapping: {},
  teamIdAndTypeMapping: {},
  teamIdAndUnreadCountMapping: {},
  teamIdAndBadgeCountMapping: {},
};

export function channelsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHANNELS_START:
      return {
        ...state,
        isLoading: true,
        userIdAndTeamIdMapping: {},
        teamIdAndNameMapping: {},
        teamIdAndTypeMapping: {},
      };

    case Actions.UPDATE_CURRENT_ORG_ID:
      return {...state, isLoading: true};

    case Actions.FETCH_CHANNELS_SUCCESS:
      var {channels, userId, userName} = action;
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping = {};
      var teamIdAndTypeMapping = {};
      var channelIdAndDataMapping = {};

      channels.forEach(channel => {
        const {_id, type, userIds} = channel;
        channelIdAndDataMapping[_id] = channel;

        if (type === 'DIRECT_MESSAGE') {
          let dmUserId = userIds?.find(id => id !== userId);
          userIdAndTeamIdMapping[dmUserId] = _id;
        } else {
          if (type === 'PERSONAL') {
            userIdAndTeamIdMapping[userIds[0]] = _id;
            channel.name = userName + ' (You)';
          }
          teamIdAndNameMapping[_id] = channel?.name;
        }
        teamIdAndTypeMapping[_id] = type;
      });

      return {
        ...state,
        channels,
        isLoading: false,
        userIdAndTeamIdMapping,
        teamIdAndNameMapping,
        teamIdAndTypeMapping,
        channelIdAndDataMapping,
      };
    case Actions.FETCH_CHANNEL_DETAILS_SUCCESS:
      let teamIdAndUnreadCountMapping = {};
      let teamIdAndBadgeCountMapping = {};
      action?.payload?.map(team => {
        teamIdAndUnreadCountMapping[team?.teamId] = team?.unreadCount;
        teamIdAndBadgeCountMapping[team?.teamId] = team?.badgeCount;
      });
      return {
        ...state,
        teamIdAndUnreadCountMapping: teamIdAndUnreadCountMapping,
        teamIdAndBadgeCountMapping: teamIdAndBadgeCountMapping,
      };

    case Actions.FETCH_RECENT_CHANNELS_SUCCESS:
      var tempRecentChannels = [];
      var key = null;
      for (let i = 0; i < action?.recentChannels?.length; i++) {
        key = action?.recentChannels[i]?.teamId;
        tempRecentChannels.push(state?.channelIdAndDataMapping[key]);
      }
      return {...state, recentChannels: tempRecentChannels};

    case Actions.FETCH_CHANNELS_ERROR:
      return {...state, channels: [], isLoading: false};

    case Actions.MOVE_CHANNEL_TO_TOP:
      var tempHighlightChannels = {};
      let teamIdAndUnreadCountMappingLocal = {};
      let teamIdAndBadgeCountMappingLocal = {};
      var newRecentChannels = state?.recentChannels;
      action?.channelId.forEach(id => {
        if (state?.activeChannelTeamId != id) {
          tempHighlightChannels[id] = true;
          if (action?.senderId != action?.userId) {
            teamIdAndUnreadCountMappingLocal[id] =
              state?.teamIdAndUnreadCountMapping[id] != undefined
                ? state?.teamIdAndUnreadCountMapping[id] + 1
                : 1;
            teamIdAndBadgeCountMappingLocal[id] = 0;
          }
        } else {
          tempHighlightChannels[id] = false;
        }
        const channelToAddInRecentChannels = state?.channels.find(
          obj => obj['_id'] === id,
        );
        if (
          channelToAddInRecentChannels &&
          !newRecentChannels.find(obj => obj['_id'] === id)
        ) {
          newRecentChannels.push(channelToAddInRecentChannels);
        }
        if (newRecentChannels[0]?._id != id) {
          for (let i = 0; i < newRecentChannels?.length; i++) {
            if (newRecentChannels[i]?._id == id) {
              newRecentChannels?.unshift(newRecentChannels[i]);
              newRecentChannels?.splice(i + 1, 1);
              break;
            }
          }
        }
      });
      return {
        ...state,
        recentChannels: newRecentChannels,
        highlightChannel: {
          ...state?.highlightChannel,
          ...tempHighlightChannels,
        },
        teamIdAndUnreadCountMapping: {
          ...state?.teamIdAndUnreadCountMapping,
          ...teamIdAndUnreadCountMappingLocal,
        },
        teamIdAndBadgeCountMapping: {
          ...state?.teamIdAndBadgeCountMapping,
          ...teamIdAndBadgeCountMappingLocal,
        },
      };

    case Actions.CREATE_NEW_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping = {};
      var teamIdAndTypeMapping = {};
      var channelIdAndDataMapping = {};
      var teamIdKey;
      if (action?.channel?.type == 'DIRECT_MESSAGE') {
        key =
          action?.channel.userIds[0] != action?.userId
            ? action?.channel?.userIds[0]
            : action?.channel.userIds[1];
        teamIdKey = action?.channel?._id;
        userIdAndTeamIdMapping[key] = teamIdKey;
        teamIdAndTypeMapping[teamIdKey] = action?.channel?.type;
      } else if (
        action?.channel.type == 'PUBLIC' ||
        action?.channel?.type == 'DEFAULT' ||
        action?.channel?.type == 'PRIVATE'
      ) {
        key = action?.channel._id;
        teamIdAndTypeMapping[key] = action?.channel?.type;
        teamIdAndNameMapping[key] = action?.channel?.name;
      }
      channelIdAndDataMapping[action?.channel._id] = action?.channel;
      return {
        ...state,
        channels: [action.channel, ...state?.channels],
        recentChannels: [action.channel, ...state?.recentChannels],
        userIdAndTeamIdMapping: {
          ...state?.userIdAndTeamIdMapping,
          ...userIdAndTeamIdMapping,
        },
        teamIdAndNameMapping: {
          ...state?.teamIdAndNameMapping,
          ...teamIdAndNameMapping,
        },
        teamIdAndTypeMapping: {
          ...state?.teamIdAndTypeMapping,
          ...teamIdAndTypeMapping,
        },
        channelIdAndDataMapping: {
          ...state?.channelIdAndDataMapping,
          ...channelIdAndDataMapping,
        },
      };

    case Actions.SET_ACTIVE_CHANNEL_TEAMID:
      var tempHighlightChannels = {...state.highlightChannel};
      tempHighlightChannels[action?.teamId] = false;
      return {
        ...state,
        activeChannelTeamId: action?.teamId,
        highlightChannel: tempHighlightChannels,
      };

    case Actions.RESET_UNREAD_COUNT_SUCCESS:
      return {
        ...state,
        teamIdAndUnreadCountMapping: {
          ...state?.teamIdAndUnreadCountMapping,
          [action?.teamId]: action?.response?.unreadCount,
        },
        teamIdAndBadgeCountMapping: {
          ...state?.teamIdAndBadgeCountMapping,
          [action?.teamId]: action?.response?.badgeCount,
        },
      };

    case Actions.RESET_ACTIVE_CHANNEL_TEAMID:
      return {...state, activeChannelTeamId: null};

    case Actions.GET_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping = {};
      var teamIdAndTypeMapping = {};
      var channelIdAndDataMapping = {};
      if (action?.channel?.type == 'DIRECT_MESSAGE') {
        key =
          action?.channel.userIds[0] != action?.userId
            ? action?.channel?.userIds[0]
            : action?.channel.userIds[1];
        teamId = action?.channel?._id;
        userIdAndTeamIdMapping[key] = teamId;
        teamIdAndTypeMapping[teamId] = action?.channel?.type;
      } else {
        key = action?.channel._id;
        teamIdAndTypeMapping[key] = action?.channel?.type;
        teamIdAndNameMapping[key] = action?.channel?.name;
      }
      channelIdAndDataMapping[action.channel._id] = action.channel;
      return {
        ...state,
        channels: [action.channel, ...state?.channels],
        recentChannels: [action.channel, ...state?.recentChannels],
        userIdAndTeamIdMapping: {
          ...state?.userIdAndTeamIdMapping,
          ...userIdAndTeamIdMapping,
        },
        teamIdAndNameMapping: {
          ...state?.teamIdAndNameMapping,
          ...teamIdAndNameMapping,
        },
        teamIdAndTypeMapping: {
          ...state?.teamIdAndTypeMapping,
          ...teamIdAndTypeMapping,
        },
        channelIdAndDataMapping: {
          ...state?.channelIdAndDataMapping,
          ...channelIdAndDataMapping,
        },
      };
    case Actions.CLOSE_CHANNEL_SUCCESS:
      for (let i = 0; i < state?.recentChannels?.length; i++) {
        if (action?.teamId == state?.recentChannels[i]?._id) {
          state?.recentChannels?.splice(i, 1);
          break;
        }
      }
      return {...state};

    case Actions.ADD_USER_SUCCESS:
      const {userIdToAdd, channelId} = action;
      var tempChannelIdAndDataMap = {...state.channelIdAndDataMapping};
      tempChannelIdAndDataMap[channelId].userIds?.push(userIdToAdd);
      return {
        ...state,
        channelIdAndDataMapping: tempChannelIdAndDataMap,
      };

    case Actions.REMOVE_USER_SUCCESS:
      const {userIdToRemove, teamId} = action;
      var tempChannelIdAndDataMap = {...state.channelIdAndDataMapping};
      const index =
        tempChannelIdAndDataMap[teamId]?.userIds?.indexOf(userIdToRemove);
      if (index !== -1) {
        tempChannelIdAndDataMap[teamId]?.userIds.splice(index, 1);
      }
      return {
        ...state,
        channelIdAndDataMapping: tempChannelIdAndDataMap,
      };

    case Actions.JOIN_CHANNEL_SUCCESS:
      var tempChannelIdAndDataMap = state?.channelIdAndDataMapping;
      if (
        !tempChannelIdAndDataMap[action?.teamId]?.userIds?.includes(
          action?.userId,
        )
      ) {
        tempChannelIdAndDataMap[action?.teamId]?.userIds?.push(action?.userId);
      }
      return {
        ...state,
        channelIdAndDataMapping: tempChannelIdAndDataMap,
      };
    case Actions.CHANNEL_PATCHED_EVENT:
      var tempChannelIdAndDataMap = state?.channelIdAndDataMapping;
      tempChannelIdAndDataMap[action?.response?._id] = action?.response;
      return {
        ...state,
        channelIdAndDataMapping: tempChannelIdAndDataMap,
      };
    case Actions.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}

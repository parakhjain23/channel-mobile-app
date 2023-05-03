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
  teamIdAndBadgeCountMapping:{}
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
      var {channels, userId,userName} = action;
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
            userIdAndTeamIdMapping[userIds[0]]=_id
            channel.name = userName +" (You)"
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
      let teamIdAndBadgeCountMapping = {}
      action?.payload?.map(team => {
        teamIdAndUnreadCountMapping[team?.teamId] = team?.unreadCount;
        teamIdAndBadgeCountMapping[team?.teamId]=team?.badgeCount
      });
      return {
        ...state,
        teamIdAndUnreadCountMapping: teamIdAndUnreadCountMapping,
        teamIdAndBadgeCountMapping: teamIdAndBadgeCountMapping
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

    // case Actions.MOVE_CHANNEL_TO_TOP:
    //   var tempHighlightChannels = {};
    //   if (state?.activeChannelTeamId != action.channelId) {
    //     tempHighlightChannels[action.channelId] = true;
    //   } else {
    //     tempHighlightChannels[action.channelId] = false;
    //   }
    //   const channelToAddInRecentChannels = state?.channels.find(
    //     obj => obj['_id'] === action?.channelId,
    //   );
    //   if (
    //     channelToAddInRecentChannels &&
    //     !state?.recentChannels.find(obj => obj['_id'] === action?.channelId)
    //   ) {
    //     state?.recentChannels.push(channelToAddInRecentChannels);
    //   }
    //   if (state?.recentChannels[0]?._id != action?.channelId) {
    //     for (let i = 0; i < state?.recentChannels?.length; i++) {
    //       if (state?.recentChannels[i]?._id == action?.channelId) {
    //         state?.recentChannels?.unshift(state?.recentChannels[i]);
    //         state?.recentChannels?.splice(i + 1, 1);
    //         break;
    //       }
    //     }
    //   }
    //   return {
    //     ...state,
    //     recentChannels: state?.recentChannels,
    //     highlightChannel: {...state.highlightChannel, ...tempHighlightChannels},
    //   };
    case Actions.MOVE_CHANNEL_TO_TOP:
      var tempHighlightChannels = {};
      let teamIdAndUnreadCountMappingLocal = {};
      let teamIdAndBadgeCountMappingLocal = {}
      const newRecentChannels = [...state?.recentChannels]; // create a new copy of recentChannels array
      action?.channelId.forEach(id => {
        if (state?.activeChannelTeamId != id) {
          tempHighlightChannels[id] = true;
          if (action?.senderId != action?.userId) {
            teamIdAndUnreadCountMappingLocal[id] =
              state?.teamIdAndUnreadCountMapping[id] + 1;
            teamIdAndBadgeCountMappingLocal[id]=
              0
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
        teamIdAndBadgeCountMapping:{
          ...state?.teamIdAndBadgeCountMapping,
          ...teamIdAndBadgeCountMappingLocal
        }
      };

    case Actions.CREATE_NEW_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping = {};
      var teamIdAndTypeMapping = {};
      if (action?.channel?.type == 'DIRECT_MESSAGE') {
        key =
          action?.channel.userIds[0] != action?.userId
            ? action?.channel?.userIds[0]
            : action?.channel.userIds[1];
        teamId = action?.channel?._id;
        userIdAndTeamIdMapping[key] = teamId;
        teamIdAndTypeMapping[teamId] = action?.channel?.type;
      } else if (
        action?.channel.type == 'PUBLIC' ||
        action?.channel?.type == 'DEFAULT' ||
        action?.channel?.type == 'PRIVATE'
      ) {
        key = action?.channel._id;
        teamIdAndTypeMapping[key] = action?.channel?.type;
        teamIdAndNameMapping[key] = action?.channel?.name;
      }
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
        teamIdAndBadgeCountMapping:{
          ...state?.teamIdAndBadgeCountMapping,
          [action?.teamId]: action?.response?.badgeCount
        }
      };

    case Actions.RESET_ACTIVE_CHANNEL_TEAMID:
      return {...state, activeChannelTeamId: null};

    case Actions.GET_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping = {};
      var teamIdAndTypeMapping = {};
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
      };
    case Actions.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}

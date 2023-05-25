import * as Actions from '../../Enums';

const initialState = {
  channels: [],
  recentChannels: [],
  groupedChannels:[{unread: []},
  {today: []},
  {yesterday: []},
  {old: []}],
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
      // console.log(action,"recent channels");
      var groupedChannels = [
        {unread: []},
        {today: []},
        {yesterday: []},
        {old: []},
      ];
      var todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      var todayTimeString =
        `${todayDate.getFullYear()}` +
        `${todayDate.getMonth() + 1}` +
        `${todayDate.getDate()}`;
      var yesterdayTimeString =
        `${todayDate.getFullYear()}` +
        `${todayDate.getMonth() + 1}` +
        `${todayDate.getDate() - 1}`;
      var tempRecentChannels = [];
      var key = null;
      for (let i = 0; i < action?.recentChannels?.length; i++) {
        var itemLastUpdatedAt = new Date(
          action?.recentChannels[i]?.lastUpdatedAt,
        );
        var lastUpdateAtString =
          `${itemLastUpdatedAt.getFullYear()}` +
          `${itemLastUpdatedAt.getMonth() + 1}` +
          `${itemLastUpdatedAt.getDate()}`;
        key = action?.recentChannels[i]?.teamId;
        tempRecentChannels.push(state?.channelIdAndDataMapping[key]);
        if (
          action?.recentChannels[i]?.badgeCount > 0 ||
          action?.recentChannels[i]?.unreadCount > 0
        ) {
          groupedChannels[0].unread.push(state?.channelIdAndDataMapping[key]);
        } else if (todayTimeString == lastUpdateAtString) {
          groupedChannels[1].today.push(state?.channelIdAndDataMapping[key]);
        } else if (lastUpdateAtString == yesterdayTimeString) {
          groupedChannels[2].yesterday.push(
            state?.channelIdAndDataMapping[key],
          );
        } else {
          groupedChannels[3].old.push(state?.channelIdAndDataMapping[key]);
        }
      }
      console.log("sucess");
      return {
        ...state,
        recentChannels: tempRecentChannels,
        groupedChannels: groupedChannels,
      };

    case Actions.FETCH_CHANNELS_ERROR:
      return {...state, channels: [], isLoading: false};

    case Actions.MOVE_CHANNEL_TO_TOP:
      var tempHighlightChannels = {};
      let teamIdAndUnreadCountMappingLocal = {};
      let teamIdAndBadgeCountMappingLocal = {}
      const newRecentChannels = [...state?.recentChannels];
      action?.channelId.forEach(id => {
        if (state?.activeChannelTeamId != id) {
          tempHighlightChannels[id] = true;
          if (action?.senderId != action?.userId) {
            teamIdAndUnreadCountMappingLocal[id] =
              state?.teamIdAndUnreadCountMapping[id] !=undefined ? state?.teamIdAndUnreadCountMapping[id] + 1: 1;
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
      console.log(action,"this is success action");
      var localGroupedChannels = state?.groupedChannels
      var itemToMoveInDifferentGroup
      var todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      var todayTimeString =
        `${todayDate.getFullYear()}` +
        `${todayDate.getMonth() + 1}` +
        `${todayDate.getDate()}`;
        var yesterdayTimeString =
        `${todayDate.getFullYear()}` +
        `${todayDate.getMonth() + 1}` +
        `${todayDate.getDate()-1}`;
        var itemLastUpdatedAt = new Date(
          action?.response?.lastUpdatedAt
        );
        var lastUpdateAtString =
          `${itemLastUpdatedAt.getFullYear()}` +
          `${itemLastUpdatedAt.getMonth() + 1}` +
          `${itemLastUpdatedAt.getDate()}`;   
     if(action?.response?.unreadCount == 0 && action?.response?.badgeCount == 0){
      for(let i =0 ; i < state?.groupedChannels[0]?.unread?.length ; i++){
        if(action.teamId == state?.groupedChannels[0]?.unread[i]?._id ){
          itemToMoveInDifferentGroup = localGroupedChannels[0]?.unread?.splice(i,1)
          console.log(itemToMoveInDifferentGroup,"item to move");
          if(todayTimeString == lastUpdateAtString){
            console.log("inside today");
            console.log(itemToMoveInDifferentGroup,"=-=-");
            localGroupedChannels[1]?.today?.unshift(itemToMoveInDifferentGroup[0])
            break
          }else if(lastUpdateAtString == yesterdayTimeString){
            console.log("inside yesterday");
            localGroupedChannels[2]?.yesterday?.unshift(itemToMoveInDifferentGroup[0])
            break
          }else{
            console.log("inside old");
            localGroupedChannels[3]?.old?.unshift(itemToMoveInDifferentGroup[0])
            break
          }
        }
      }
     }else if((action?.response?.unreadCount > 0 ||action?.response?.badgeCount > 0) && todayTimeString == lastUpdateAtString){
      for(let i =0 ; i < state?.groupedChannels[1]?.today?.length ; i++){
        if(action.teamId == state?.groupedChannels[1]?.today[i]?._id ){
          itemToMoveInDifferentGroup = localGroupedChannels[1]?.today?.splice(i,1)
          localGroupedChannels[0]?.unread?.unshift(itemToMoveInDifferentGroup[0])
          break
        }
      }
     }else if((action?.response?.unreadCount > 0 ||action?.response?.badgeCount > 0) && todayTimeString == yesterdayTimeString){
      for(let i =0 ; i < state?.groupedChannels[2]?.yesterday?.length ; i++){
        if(action.teamId == state?.groupedChannels[2]?.yesterday[i]?._id ){
          itemToMoveInDifferentGroup = localGroupedChannels[2]?.yesterday?.splice(i,1)
          localGroupedChannels[0]?.unread?.unshift(itemToMoveInDifferentGroup[0])
          break
        }
      }
     }else if(action?.response?.unreadCount > 0 ||action?.response?.badgeCount > 0){
      for(let i =0 ; i < state?.groupedChannels[3]?.old?.length ; i++){
        if(action.teamId == state?.groupedChannels[3]?.old[i]?._id ){
          itemToMoveInDifferentGroup = localGroupedChannels[3]?.old?.splice(i,1)
          localGroupedChannels[0]?.unread?.unshift(itemToMoveInDifferentGroup[0])
          break
        }
      }
     }
      console.log("-=-=-=-=-=--0-90090899786786",localGroupedChannels[0].unread);
      return {
        ...state,
        teamIdAndUnreadCountMapping: {
          ...state?.teamIdAndUnreadCountMapping,
          [action?.teamId]: action?.response?.unreadCount,
        },
        teamIdAndBadgeCountMapping:{
          ...state?.teamIdAndBadgeCountMapping,
          [action?.teamId]: action?.response?.badgeCount
        },
        groupedChannels : localGroupedChannels
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
    case Actions.CLOSE_CHANNEL_SUCCESS:
      for(let i =0 ; i < state?.recentChannels?.length ; i++){
        if(action?.teamId == state?.recentChannels[i]?._id){
          state?.recentChannels?.splice(i,1)
          break;
        }
      }
      return {...state}
    case Actions.SIGN_OUT:
      return initialState;
    default:
      return state;
  }
}

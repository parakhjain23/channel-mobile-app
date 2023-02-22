import * as Actions from '../../Enums';
import { store } from '../../Store';

const initialState = {
  channels: [],
  recentChannels:[],
  isLoading: false,
  activeChannelTeamId : null,
  highlightChannel : {},
  userIdAndTeamIdMapping:{},
  teamIdAndNameMapping:{},
  teamIdAndTypeMapping:{}
};

export function channelsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHANNELS_START:
      return {...state, isLoading: true,userIdAndTeamIdMapping:{},teamIdAndNameMapping:{},teamIdAndTypeMapping:{}};

    case Actions.UPDATE_CURRENT_ORG_ID:
      return {...state, isLoading: true};

    case Actions.FETCH_CHANNELS_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping ={}
      var tempteamIdAndTypeMapping={}
      var channelIdAndDataMapping={}
      var key = null;
      var teamId = null
      for (let i = 0; i < action?.channels?.length; i++) {
        if (action?.channels[i]?.type == 'DIRECT_MESSAGE') {
          key =
            action?.channels[i].userIds[0] != action?.userId
              ? action?.channels[i]?.userIds[0]
              : action?.channels[i].userIds[1];
          teamId= action?.channels[i]?._id    
          userIdAndTeamIdMapping[key] = teamId;
        }else{
          key = action?.channels[i]._id
          teamIdAndNameMapping[key] = action?.channels[i]?.name
        }
        tempteamIdAndTypeMapping[action?.channels[i]?._id]=action?.channels[i]?.type
        channelIdAndDataMapping[action?.channels[i]?._id]=action.channels[i]
      }
      return {
        ...state,
        channels: action.channels,
        isLoading: false,
        userIdAndTeamIdMapping: userIdAndTeamIdMapping,
        teamIdAndNameMapping: teamIdAndNameMapping,
        teamIdAndTypeMapping: tempteamIdAndTypeMapping,
        channelIdAndDataMapping: channelIdAndDataMapping
      };
    
    case Actions.FETCH_RECENT_CHANNELS_SUCCESS:
      var tempRecentChannels = []
      var key = null
      for(let i=0;i<action?.recentChannels?.length;i++){
        key = action?.recentChannels[i]?.teamId
        tempRecentChannels.push(state?.channelIdAndDataMapping[key])
      }
      return {...state,recentChannels:tempRecentChannels}  
    
    case Actions.FETCH_CHANNELS_ERROR:
      return {...state, channels: [], isLoading: false};

    //Move Channels To top
    // case Actions.MOVE_CHANNEL_TO_TOP:
    //   var tempHighlightChannels ={}
    //   if(state?.activeChannelTeamId != action.channelId){
    //     tempHighlightChannels[action.channelId] =true
    //   }else{
    //     tempHighlightChannels[action.channelId]=false
    //   } 
    //   if (state?.channels[0]?._id != action?.channelId) {
    //     for (let i = 0; i < state?.channels?.length; i++) {
    //       if (state?.channels[i]?._id == action?.channelId) {
    //         state?.channels?.unshift(state?.channels[i]);
    //         state?.channels?.splice(i + 1, 1);
    //         break;
    //       }
    //     }
    //   }
    //   return {...state, channels: state?.channels, highlightChannel : {...state.highlightChannel,...tempHighlightChannels}};

    //Move Recent Channels to top
    case Actions.MOVE_CHANNEL_TO_TOP:
      var tempHighlightChannels ={}
      if(state?.activeChannelTeamId != action.channelId){
        tempHighlightChannels[action.channelId] =true
      }else{
        tempHighlightChannels[action.channelId]=false
      } 
      if (state?.recentChannels[0]?._id != action?.channelId) {
      for (let i = 0; i < state?.recentChannels?.length; i++) {
          if (state?.recentChannels[i]?._id == action?.channelId) {
            state?.recentChannels?.unshift(state?.recentChannels[i]);
            state?.recentChannels?.splice(i + 1, 1);
            break;
          }
        }
      }
      return {...state, recentChannels: state?.recentChannels, highlightChannel : {...state.highlightChannel,...tempHighlightChannels}};

    case Actions.CREATE_NEW_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping ={}
      var teamIdAndTypeMapping={}
      if (action?.channel?.type == 'DIRECT_MESSAGE') {
        key =
          action?.channel.userIds[0] != action?.userId
            ? action?.channel?.userIds[0]
            : action?.channel.userIds[1];
        teamId=action?.channel?._id    
        userIdAndTeamIdMapping[key] = teamId;
        teamIdAndTypeMapping[teamId]=action?.channel?.type
      }else if(action?.channel.type == 'PUBLIC' || action?.channel?.type == 'DEFAULT' || action?.channel?.type == 'PRIVATE'){
        key = action?.channel._id 
        teamIdAndTypeMapping[key]=action?.channel?.type
        teamIdAndNameMapping[key] = action?.channel?.name
      }
      return {
        ...state,
        // channels: [action.channel, ...state?.channels],
        recentChannels: [action.channel, ...state?.recentChannels],
        userIdAndTeamIdMapping: {
          ...state?.userIdAndTeamIdMapping,
        ...userIdAndTeamIdMapping
        },
        teamIdAndNameMapping:{
          ...state?.teamIdAndNameMapping,
          ...teamIdAndNameMapping
        },
        teamIdAndTypeMapping:{
          ...state?.teamIdAndTypeMapping,
          ...teamIdAndTypeMapping
        }
      };
    
    case Actions.SET_ACTIVE_CHANNEL_TEAMID:
      var tempHighlightChannels={...state.highlightChannel}
      tempHighlightChannels[action?.teamId]=false
      return {...state, activeChannelTeamId : action?.teamId, highlightChannel : tempHighlightChannels} 
    
    case Actions.RESET_ACTIVE_CHANNEL_TEAMID:
      return{...state, activeChannelTeamId : null}  
    default:
      return state;
  }
}

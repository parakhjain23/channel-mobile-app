import * as Actions from '../../Enums';

const initialState = {
  channels: [],
  isLoading: false,
  activeChannelTeamId : null
};

export function channelsReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHANNELS_START:
      return {...state, isLoading: true};

    case Actions.UPDATE_CURRENT_ORG_ID:
      return {...state, isLoading: true};

    case Actions.FETCH_CHANNELS_SUCCESS:
      var userIdAndTeamIdMapping = {};
      var teamIdAndNameMapping ={}
      var key = null;
      for (let i = 0; i < action?.channels?.length; i++) {
        if (action?.channels[i]?.type == 'DIRECT_MESSAGE') {
          key =
            action?.channels[i].userIds[0] != action?.userId
              ? action?.channels[i]?.userIds[0]
              : action?.channels[i].userIds[1];
          userIdAndTeamIdMapping[key] = action?.channels[i]?._id;
        }else if(action?.channels[i]?.type == 'PUBLIC' || action?.channels[i]?.type == 'DEFAULT'){
          key = action?.channels[i]._id 
          teamIdAndNameMapping[key] = action?.channels[i]?.name
        }
      }
      console.log(teamIdAndNameMapping,"-=-=-=-=-=-=-=-");
      return {
        ...state,
        channels: action.channels,
        isLoading: false,
        userIdAndTeamIdMapping: userIdAndTeamIdMapping,
        teamIdAndNameMapping: teamIdAndNameMapping
      };

    case Actions.FETCH_CHANNELS_ERROR:
      return {...state, channels: [], isLoading: false};

    case Actions.MOVE_CHANNEL_TO_TOP:
      if (state?.channels[0]?._id != action?.channelId) {
        for (let i = 0; i < state?.channels?.length; i++) {
          if (state?.channels[i]?._id == action?.channelId) {
            state?.channels?.unshift(state?.channels[i]);
            state?.channels?.splice(i + 1, 1);
            break;
          }
        }
      }
      return {...state, channels: state?.channels};

    case Actions.CREATE_NEW_CHANNEL_SUCCESS:
      var userIdAndTeamIdMapping = {};
      if (action?.channel?.type == 'DIRECT_MESSAGE') {
        key =
          action?.channel.userIds[0] != action?.userId
            ? action?.channel?.userIds[0]
            : action?.channel.userIds[1];
        userIdAndTeamIdMapping[key] = action?.channel?._id;
      }
      return {
        ...state,
        channels: [action.channel, ...state?.channels],
        userIdAndTeamIdMapping: {
          ...state?.userIdAndTeamIdMapping,
          ...userIdAndTeamIdMapping,
        },
      };
    
    case Actions.SET_ACTIVE_CHANNEL_TEAMID:
      return {...state, activeChannelTeamId : action?.teamId} 
    
    case Actions.RESET_ACTIVE_CHANNEL_TEAMID:
      return{...state, activeChannelTeamId : null}  
    default:
      return state;
  }
}

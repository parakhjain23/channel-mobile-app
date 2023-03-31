import * as Actions from '../../Enums';

const initialState = {
  channels: [],
  mentionChannels:[{_source:{displayName:'channel',type:'U'}}],
  isLoading: false,
};

export function channelsByQueryReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHANNELS_BY_QUERY_START:
      return {...state, isLoading: true};

    case Actions.FETCH_CHANNELS_BY_QUERY_SUCCESS:
      return {...state, channels: action.channels,mentionChannels:[...state?.mentionChannels,...action.channels], isLoading: false};

    case Actions.FETCH_CHANNELS_BY_QUERY_ERROR:
      return {...state, channels: [], isLoading: false};

    // case Actions.MOVE_CHANNEL_TO_TOP:
    //   if (state?.channels[0]?._id != action?.channelId) {
    //     for (let i = 0; i < state?.channels?.length; i++) {
    //       if (state?.channels[i]?._id == action?.channelId) {
    //         state?.channels?.unshift(state?.channels[i]);
    //         state?.channels?.splice(i + 1, 1);
    //         break;
    //       }
    //     }
    //   }
    //   return {...state, channels: state?.channels};

    default:
      return state;
  }
}

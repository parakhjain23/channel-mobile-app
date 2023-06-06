import * as Actions from '../../Enums';

const initialState = {
  channels: [],
  mentionChannels: [],
  isLoading: false,
};

export function channelsByQueryReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHANNELS_BY_QUERY_START:
      return {...state, isLoading: true};

    case Actions.FETCH_CHANNELS_BY_QUERY_SUCCESS:
      return {
        ...state,
        channels: action.channels,
        mentionChannels: [
          {_source: {displayName: 'channel', type: 'U'}},
          ...action.channels,
        ],
        isLoading: false,
      };

    case Actions.FETCH_CHANNELS_BY_QUERY_ERROR:
      return {...state, channels: [], isLoading: false};

    default:
      return state;
  }
}

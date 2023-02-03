import * as Actions from '../../Enums';

const initialState = {
  data: {},
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      return {
        ...state,
        data: {...state.data, [action.teamId]: {isloading: true, messages: []}},
      };
    case Actions.FETCH_CHAT_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.teamId]: {messages: action?.payload, isloading: false},
        },
      };
    case Actions.ADD_NEW_MESSAGE:
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages: state?.data[action?.teamId]?.messages
              ? [action?.message, ...state?.data[action?.teamId]?.messages]
              : [action?.message],
          },
        },
      };

    case Actions.UPDATE_CURRENT_ORG_ID:
      return { initialState }
       
    default:
      return state;
  }
}

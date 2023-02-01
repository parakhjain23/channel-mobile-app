import * as Actions from '../../Enums';

const initialState = {
  data: {},
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      console.log('in start');
      return {
        ...state,
        data: {...state.data, [action.teamId]: {isloading: true, messages: []}},
      };
    case Actions.FETCH_CHAT_SUCCESS:
      console.log('in success');
      return {
        ...state,
        data: {
          ...state.data,
          [action.teamId]: {messages: action?.payload, isloading: false},
        },
      };
      case Actions.ADD_NEW_MESSAGE:
        console.log('redddd',action);
        return {
          ...state,
          data: {
            ...state.data,
            [action.teamId]: {messages: [...state.data[action.teamId].messages,action.message]}
          }
        }
    default:
      return state;
  }
}

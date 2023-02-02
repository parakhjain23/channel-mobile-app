import * as Actions from '../../Enums';

const initialState = {
  data: {},
};

export function chatReducer(state = initialState, action) {
  console.log("inside chat reducer");
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      console.log(action.teamId,"this is team id of parakh chat");
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
        console.log('redddd this is team id of parakh by socket',action.teamId);
        return {
          ...state,
          data: { 
            ...state?.data,
            [action.teamId]: {messages:[action?.message,...state?.data[action?.teamId]?.messages]}
          }
        }
    default:
      return state;
  }
}

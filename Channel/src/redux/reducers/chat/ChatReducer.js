import * as Actions from '../../Enums';

const initialState = {
  data: {},
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      return {
        ...state,
        data: {...state.data, [action.teamId]: {isloading: true, messages: [], parentMessages: []}},
      };
    case Actions.FETCH_CHAT_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [action.teamId]: {messages: action?.messages, parentMessages: action?.parentMessages , isloading: false , apiCalled : true},
        },
      };
    case Actions.ADD_NEW_MESSAGE:
      console.log(action,"this is action");
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages: state?.data[action?.teamId]?.messages
              ? [action?.message, ...state?.data[action?.teamId]?.messages]
              : [action?.message],  
            parentMessages: state?.data[action?.teamId]?.parentMessages 
              ? [action?.parentMessage,...state?.data[action?.teamId]?.parentMessages]
              : [action?.parentMessage]
          },
        },
      };
    
    case Actions.DELETE_MESSAGE_SUCCESS:
      for(let i=0;i<state?.data[action.teamId]?.messages?.length;i++){
        console.log(state?.data[action.teamId]?.messages[i]._id );
        if(state?.data[action.teamId]?.messages[i]._id == action.msgIdToDelete){
          state?.data[action.teamId]?.messages?.splice(i,1)
          break;
        }
      }
      return {
        ...state
      }  
    case Actions.UPDATE_CURRENT_ORG_ID:
      return initialState;
      
    default:
      return state;
  }
}

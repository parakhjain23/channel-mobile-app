import * as Actions from '../../Enums';

const initialState = {
  data: {},
  // localMessages: []
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            isloading:  state?.data[action?.teamId]?.messages?.length==0 ? true : false,
            messages: state?.data[action?.teamId]?.messages
              ? state?.data[action?.teamId]?.messages
              : [],
            parentMessages: state?.data[action?.teamId]?.parentMessages
              ? {...state?.data?.[action?.teamId]?.parentMessages}
              : {},
            localMessages: state?.data[action?.teamId]?.localMessages ?
              state?.data[action?.teamId]?.localMessages :
              []  
          },
        },
      };

    case Actions.FETCH_CHAT_SUCCESS:
      var tempParentMessages = {};
      var parentId = null;
      for (let i = 0; i < action?.parentMessages?.length; i++) {
        parentId = action?.parentMessages[i]?._id;
        tempParentMessages[parentId] = action?.parentMessages[i];
      }
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages: [
              ...state?.data[action?.teamId]?.messages,
              ...action?.messages,
            ],
            parentMessages: {
              ...state?.data[action?.teamId]?.parentMessages,
              ...tempParentMessages,
            },
            localMessages: state?.data[action?.teamId]?.localMessages,
            isloading: false,
            apiCalled: true,
          },
        },
      };

    case Actions.FETCH_CHAT_RESET:
      return initialState;
    case Actions.ADD_NEW_MESSAGE:
      var tempParentMessage = {};
      var parentId = null;
      parentId = action?.parentMessage?._id;
      tempParentMessage[parentId] = action?.parentMessage;
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages: state?.data[action?.teamId]?.messages
              ? [action?.message, ...state?.data[action?.teamId]?.messages]
              : [action?.message],
            parentMessages:
              state?.data[action?.teamId]?.parentMessages == undefined
                ? tempParentMessage
                : {
                    ...state.data[action?.teamId]?.parentMessages,
                    [parentId]: tempParentMessage[parentId],
                  },
          },
        },
      };
      case Actions.LOCAL_MESSAGE_TO_SAVE_IN_STATE:
        var tempMessage = []
        tempMessage.push(action?.data)
        return {...state,
          data:{
            ...state?.data,
            [action.data.teamId]:{
              ...state?.data[action?.data?.teamId],
              localMessages:
                state?.data[action?.data?.teamId]?.localMessages?.length >0 ?[...state.data[action?.data?.teamId]?.localMessages,...tempMessage] :tempMessage  
            }
          }
        }
        // return{...state,localMessages :state.localMessages.length >0 ?[...tempMessage,...state.localMessages] :tempMessage}  

    case Actions.DELETE_MESSAGE_SUCCESS:
      for (let i = 0; i < state?.data[action.teamId]?.messages?.length; i++) {
        if (
          state?.data[action.teamId]?.messages[i]._id == action.msgIdToDelete
        ) {
          state?.data[action.teamId]?.messages?.splice(i, 1);
          break;
        }
      }
      return {
        ...state,
      };
    
    case Actions.REMOVE_LOCAL_MESSAGE_FROM_STATE:
      let filteredArray = state?.data[action?.data?.teamId]?.localMessages?.filter(obj => obj?.content !== action?.data?.content);
      console.log(filteredArray,"this is filtered Arrau");
      return{...state,localMessages : filteredArray}  
    case Actions.UPDATE_CURRENT_ORG_ID:
      return initialState;

    default:
      return state;
  }
}

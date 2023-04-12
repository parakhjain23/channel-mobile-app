import * as Actions from '../../Enums';

const initialState = {
  data: {},
  randomIdsArr:[]
};

export function chatReducer(state = initialState, action) {
  switch (action.type) {
    case Actions.FETCH_CHAT_START:
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            isloading:
              state?.data[action?.teamId]?.messages?.length == 0 ? true : false,
            messages: state?.data[action?.teamId]?.messages
              ? state?.data[action?.teamId]?.messages
              : [],
            globalMessagesToSend: state?.data[action?.teamId]
              ?.globalMessagesToSend
              ? state?.data[action?.teamId]?.globalMessagesToSend
              : [],
            parentMessages: state?.data[action?.teamId]?.parentMessages
              ? {...state?.data?.[action?.teamId]?.parentMessages}
              : {},
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
            globalMessagesToSend:
              state?.data[action?.teamId]?.globalMessagesToSend,
            parentMessages: {
              ...state?.data[action?.teamId]?.parentMessages,
              ...tempParentMessages,
            },
            isloading: false,
            apiCalled: true,
          },
        },
      };
    case Actions.SET_GLOBAL_MESSAGE_TO_SEND:
      return {
        ...state,
        data: {
          ...state?.data,
          [action.messageObj.teamId]: {
            ...state?.data[action.messageObj.teamId],
            globalMessagesToSend: state?.data[action?.messageObj?.teamId]
              ?.globalMessagesToSend
              ? [
                  ...state?.data[action?.messageObj?.teamId]
                    ?.globalMessagesToSend,
                  action.messageObj,
                ]
              : [action.messageObj],
          },
        },
      };
    case Actions.FETCH_CHAT_RESET:
      return initialState;

  case Actions.ADD_NEW_MESSAGE:
     if(action?.message?.senderId == action?.userid && state?.randomIdsArr?.length > 0){
      action.message['randomId'] = state?.randomIdsArr[0]
      state?.randomIdsArr?.shift()
      for(let i = 0; i < state?.data[action?.teamId]?.messages?.length ; i++){
        if(state?.data[action?.teamId]?.messages[i]?.randomId == action?.message?.randomId){
          state?.data[action?.teamId]?.messages?.splice(i,1)
          action.message['randomId'] = null
          break;
        }
      }
     }
      var tempParentMessage = {};
      var parentId = null;
      parentId = action?.parentMessage?._id;
      tempParentMessage[parentId] = action?.parentMessage;
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            ...state?.data[action?.teamId],
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
    case Actions.UPDATE_CURRENT_ORG_ID:
      return initialState;
    case Actions.ADD_LOCAL_MESSAGE:
      const {data} = action
      let parentKey = data?.parentId
      let parentObj={}
      if(data?.parentMessage != undefined){
        for(let i = 0 ; i < state?.data[data?.teamId]?.messages?.length; i++){
          if(state?.data[data?.teamId]?.messages[i]?._id == data?.parentId){
            parentObj[parentKey]=state?.data[data?.teamId]?.messages[i]
            break;
          }
        }
      }
      return{
        ...state,
        data:{
          ...state?.data,
          [data?.teamId]:{
            ...state?.data[data?.teamId],
            messages:state?.data[data?.teamId]?.messages ?
            [data,...state?.data[data?.teamId]?.messages] :
            [data],
            parentMessages: data?.parentMessage != undefined && state?.data[data?.teamId]?.parentMessages ?
            {...parentObj,...state?.data[data?.teamId]?.parentMessages} : parentObj 
          }
        },
        randomIdsArr: state?.randomIdsArr?.length > 0 ? [...state?.randomIdsArr,data?.randomId] : [data?.randomId]
      }

    default:
      return state;
  }
}

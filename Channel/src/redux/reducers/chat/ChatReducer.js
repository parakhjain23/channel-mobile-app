import * as Actions from '../../Enums';

const initialState = {
  data: {},
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

    default:
      return state;
  }
}

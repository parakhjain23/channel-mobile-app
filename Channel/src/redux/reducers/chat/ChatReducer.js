import * as Actions from '../../Enums';

const initialState = {
  data: {},
  randomIdsArr: [],
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
      let prevDate = null;
      for (let i = 0; i < action?.parentMessages?.length; i++) {
        parentId = action?.parentMessages[i]?._id;
        tempParentMessages[parentId] = action?.parentMessages[i];
      }
      for (let i = 0; i < action?.messages?.length; i++) {
        const date = new Date(action?.messages[i]?.updatedAt);
        const currentCreatedAt = new Date(action?.messages[i]?.createdAt);
        const prevCreatedAt = new Date(action?.messages[i + 1]?.createdAt);
        const timeDiff = Math.abs(prevCreatedAt - currentCreatedAt);
        const minutesDiff = Math.floor(timeDiff / (1000 * 60));
        const isSameDate = prevDate?.toDateString() === date.toDateString();
        let displayDate = date?.toDateString();
        if (!isSameDate && i > 0) {
          const prevDateString = prevDate?.toDateString();
          displayDate = `${prevDateString}`;
          action.messages[i]['isSameDate'] = false;
          action.messages[i]['timeToShow'] = displayDate;
        } else {
          action.messages[i]['isSameDate'] = true;
          action.messages[i]['timeToShow'] = '';
        }
        prevDate = date;
        if (
          action?.messages[i]?.senderId != action?.messages[i + 1]?.senderId
        ) {
          action.messages[i]['sameSender'] = false;
        } else if (action?.messages[i + 1]?.isActivity) {
          action.messages[i]['sameSender'] = false;
        } else if (minutesDiff > 5) {
          action.messages[i]['sameSender'] = false;
        } else {
          action.messages[i]['sameSender'] = true;
        }
        if (
          action.messages[i].attachment?.length > 0 &&
          action.messages[i].attachment[0].contentType?.includes('audio') &&
          action.messages[i].attachment[0].transcription != undefined
        ) {
          action.messages[i].content =
            action.messages[i].attachment[0].transcription;
        }
      }
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages:
              action?.skip != undefined
                ? [
                    ...state?.data[action?.teamId]?.messages,
                    ...action?.messages,
                  ]
                : [...action?.messages],
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
      if (
        action?.message?.senderId == action?.userid &&
        state?.randomIdsArr?.length > 0
      ) {
        action.message['randomId'] = state?.randomIdsArr[0];
        state?.randomIdsArr?.shift();
        for (
          let i = 0;
          i < state?.data[action?.teamId]?.messages?.length;
          i++
        ) {
          if (
            state?.data[action?.teamId]?.messages[i]?.randomId ==
            action?.message?.randomId
          ) {
            state?.data[action?.teamId]?.messages?.splice(i, 1);
            action.message['randomId'] = null;
            break;
          }
        }
      }
      const currentCreatedAt = new Date(action?.message?.createdAt);
      const prevCreatedAt = new Date(
        state?.data[action?.teamId]?.messages[0]?.createdAt,
      );
      const timeDiff = Math.abs(prevCreatedAt - currentCreatedAt);
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));
      if (
        action?.message?.senderId !=
        state?.data[action?.message?.teamId]?.messages[0]?.senderId
      ) {
        action.message['sameSender'] = false;
      } else if (minutesDiff > 5) {
        action.message['sameSender'] = false;
      } else {
        action.message['sameSender'] = true;
      }
      const date = new Date(action?.message?.updatedAt);
      const prevsDate = new Date(
        state?.data[action?.message?.teamId]?.messages[0]?.updatedAt,
      );
      const isSameDate = prevsDate?.toDateString() === date.toDateString();
      let displayDate = date?.toDateString();
      if (!isSameDate) {
        const prevDateString = date?.toDateString();
        displayDate = `${prevDateString}`;
        action.message['isSameDate'] = false;
        action.message['timeToShow'] = displayDate;
      } else {
        action.message['isSameDate'] = true;
        action.message['timeToShow'] = '';
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
      const {data} = action;
      let parentKey = data?.parentId;
      let parentObj = {};
      if (data?.parentMessage != undefined) {
        for (let i = 0; i < state?.data[data?.teamId]?.messages?.length; i++) {
          if (state?.data[data?.teamId]?.messages[i]?._id == data?.parentId) {
            parentObj[parentKey] = state?.data[data?.teamId]?.messages[i];
            break;
          }
        }
      }
      if (
        action?.message?.senderId !=
        state?.data[action?.message?.teamId]?.messages[0]?.senderId
      ) {
        data['sameSender'] = false;
      } else {
        data['sameSender'] = true;
      }
      data['isSameDate'] = true;
      return {
        ...state,
        data: {
          ...state?.data,
          [data?.teamId]: {
            ...state?.data[data?.teamId],
            messages: state?.data[data?.teamId]?.messages
              ? [data, ...state?.data[data?.teamId]?.messages]
              : [data],
            parentMessages:
              parentKey != undefined
                ? state?.data[data?.teamId]?.parentMessages
                  ? {...parentObj, ...state?.data[data?.teamId]?.parentMessages}
                  : parentObj
                : state?.data[data?.teamId]?.parentMessages,
          },
        },
        randomIdsArr:
          state?.randomIdsArr?.length > 0
            ? [...state?.randomIdsArr, data?.randomId]
            : [data?.randomId],
      };
    case Actions.CHAT_EDIT_SUCCESS:
      for (let i = 0; i < state?.data[action.teamId]?.messages?.length; i++) {
        if (state?.data[action.teamId]?.messages[i]._id == action.msgIdToEdit) {
          state.data[action.teamId].messages[i] = action?.newMessage;
          break;
        }
      }
      if (
        action?.newMessage?.senderId !=
        state?.data[action?.newMessage?.teamId]?.messages[0]?.senderId
      ) {
        action.newMessage['sameSender'] = false;
      } else {
        action.newMessage['sameSender'] = true;
      }
      action.newMessage['isSameDate'] = true;
      return {
        ...state,
      };

    case Actions.ADD_DRAFT_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          [action.teamId]: {
            ...state.data[action.teamId],
            draftMessage: action.message,
          },
        },
      };

    default:
      return state;
  }
}

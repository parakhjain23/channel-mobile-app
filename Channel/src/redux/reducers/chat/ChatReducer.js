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
          ...state.data,
          [action.teamId]: {
            isloading: true,
            messages: state?.data[action?.teamId]?.messages
              ? state?.data[action?.teamId]?.messages
              : [],
          },
        },
      };

    case Actions.FETCH_CHAT_SUCCESS:
      console.log(action?.parentMessages,'pare');
      var parMessages = {};
      var parentId = null;
      for (let i = 0; i < action?.parentMessages.length; i++) {
        parentId = action?.parentMessages[i]?._id;
        parMessages[parentId] = action?.parentMessages[i];
      }
      return {
        ...state,
        data: {
          ...state.data,
          [action.teamId]: {
            messages: [
              ...state?.data[action.teamId]?.messages,
              ...action?.messages,
            ],
            parentMessages:
              state?.data[action.teamId]?.parentMessages == undefined
                ? parMessages
                : {
                    ...state.data[action.teamId].parentMessages,
                    ...parMessages
                  },
            isloading: false,
            apiCalled: true,
          },
        },
      };
    case Actions.ADD_NEW_MESSAGE:
      var parMessages = {};
      var parentId = null;
      parentId = action?.parentMessage?._id;
      parMessages[parentId] = action?.parentMessage;
      return {
        ...state,
        data: {
          ...state?.data,
          [action.teamId]: {
            messages: state?.data[action?.teamId]?.messages
              ? [action?.message, ...state?.data[action?.teamId]?.messages]
              : [action?.message],
            parentMessages: state?.data[action.teamId]?.parentMessages == undefined ? {[action?.parentMessage?._id]:action?.parentMessage}
            : {
              ...state.data[action.teamId].parentMessages,[action?.parentMessage?._id]:action?.parentMessage
            }
            // parentMessages:
            //   state?.data[action.teamId]?.parentMessages == undefined
            //     ? parMessages
            //     : {
            //         ...state.data[action.teamId].parentMessages,
            //         [parentId]: parMessages[parentId],
            //       },
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

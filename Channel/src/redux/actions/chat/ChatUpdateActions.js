import * as Actions from '../../Enums'
export function messageEditSuccess(response){
    return {
      type: Actions.CHAT_EDIT_SUCCESS,
      teamId : response?.teamId,
      msgIdToEdit : response?._id,
      newMessage : response
    }
  }
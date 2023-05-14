import { call } from 'redux-saga/effects';
import * as Actions from '../../Enums';
import { addUsersToChannelApi, removeUserFromChannelApi } from '../../../api/channelsApi/AddUsersToChannel';

export function* addUserToChannel({userIds,teamId,orgId,accessToken}) {
    try {
      var response = yield call(
        addUsersToChannelApi,
        userIds,teamId,orgId,accessToken
      );
    } catch (error) {
      console.warn(error);
    }
  }
  export function addUserToChannelStart(userIds,teamId,orgId,accessToken){
    console.log(userIds,teamId,orgId);
    return {
      type: Actions.ADD_USER_TO_CHANNEL,
      userIds,teamId,orgId,accessToken  
    };
  }

  export function* removeUserFromChannel({userIds,teamId,orgId,accessToken}) {
    try {
      var response = yield call(
        removeUserFromChannelApi,
        userIds,teamId,orgId,accessToken
      );
    } catch (error) {
      console.warn(error);
    }
  }
  export function removeUserFromChannelStart(userIds,teamId,orgId,accessToken){
    return {
      type: Actions.REMOVE_USER_FROM_CHANNEL,
      userIds,teamId,orgId,accessToken  
    };
  }

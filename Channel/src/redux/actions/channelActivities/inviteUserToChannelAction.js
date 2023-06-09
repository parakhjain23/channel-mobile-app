import {call, put} from 'redux-saga/effects';
import * as Actions from '../../Enums';
import {
  addUsersToChannelApi,
  removeUserFromChannelApi,
} from '../../../api/channelsApi/AddUsersToChannel';
import {
  addUserSuccess,
  removeUserSuccess,
} from '../channels/CloseChannelActions';

export function* addUserToChannel({userIds, teamId, orgId, accessToken}) {
  try {
    var response = yield call(
      addUsersToChannelApi,
      userIds,
      teamId,
      orgId,
      accessToken,
    );
    yield put(addUserSuccess(response[0]));
  } catch (error) {
    console.warn(error);
  }
}
export function addUserToChannelStart(userIds, teamId, orgId, accessToken) {
  return {
    type: Actions.ADD_USER_TO_CHANNEL,
    userIds,
    teamId,
    orgId,
    accessToken,
  };
}

export function* removeUserFromChannel({userIds, teamId, orgId, accessToken}) {
  try {
    var response = yield call(
      removeUserFromChannelApi,
      userIds,
      teamId,
      orgId,
      accessToken,
    );
    yield put(removeUserSuccess(response[0]));
  } catch (error) {
    console.warn(error);
  }
}
export function removeUserFromChannelStart(
  userIds,
  teamId,
  orgId,
  accessToken,
) {
  return {
    type: Actions.REMOVE_USER_FROM_CHANNEL,
    userIds,
    teamId,
    orgId,
    accessToken,
  };
}

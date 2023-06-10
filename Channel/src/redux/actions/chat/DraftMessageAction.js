import {call} from 'redux-saga/effects';
import * as Actions from '../../Enums';
import {draftMessageApi} from '../../../api/messages/draftMessageApi';

export function* draftMessage({message, teamId, accessToken, orgId, userId}) {
  try {
    yield call(draftMessageApi, message, teamId, accessToken, orgId, userId);
  } catch (error) {
    // console.log(error);
  }
}

export function addDraftMessage(message, teamId, accessToken, orgId, userId) {
  return {
    type: Actions.ADD_DRAFT_MESSAGE,
    message: message,
    teamId: teamId,
    accessToken: accessToken,
    orgId: orgId,
    userId: userId,
  };
}

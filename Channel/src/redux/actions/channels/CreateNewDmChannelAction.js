import { call, put } from 'redux-saga/effects';
import { createChannel } from '../../../api/channelsApi/CreateChannel';
import { createDmChannel } from '../../../api/channelsApi/CreateDmChannel';
import * as Actions from '../../Enums';

export function* createNewDmChannel({token,orgId,channelName,reciverUserId}){
    try {
    console.log(token,orgId,channelName,reciverUserId,"details in crreate generator functions");
      var response = yield call(createDmChannel,token,orgId,channelName,reciverUserId)
    } catch (error) {
      console.log(error);
    }
  }

export function createNewDmChannelStart(token,orgId,channelName,reciverUserId){
    console.log(token,orgId,channelName,reciverUserId,"details in crreate start");
  return {
    type: Actions.CREATE_NEW_DM_CHANNEL_START,
    token,orgId,channelName,reciverUserId
  }
}
export function createNewChannelSuccess(data){
    return {
      type: Actions.CREATE_NEW_CHANNEL_SUCCESS,
      payload: data
    }
  }
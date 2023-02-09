import { call, put } from 'redux-saga/effects';
import { createChannel } from '../../../api/channelsApi/CreateChannel';
import * as Actions from '../../Enums';

export function* createNewChannel({token,orgId,channelName,channelType}){
    try {
      var response = yield call(createChannel,token,orgId,channelName,channelType)
    } catch (error) {
      console.log(error);
    }
  }

export function createNewChannelStart(token,orgId,channelName,channelType){
  return {
    type: Actions.CREATE_NEW_CHANNEL_START,
    token,orgId,channelName,channelType
  }
}
export function createNewChannelSuccess(data,userId){
    return {
      type: Actions.CREATE_NEW_CHANNEL_SUCCESS,
      channel: data,
      userId
    }
  }
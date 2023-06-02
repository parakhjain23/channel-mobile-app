import {ADD_LOCAL_MESSAGE} from '../../Enums';

export function setLocalMsgStart(data) {
  return {
    type: ADD_LOCAL_MESSAGE,
    data,
  };
}

import {Alert} from 'react-native';

export const createDmChannel = async (
  token,
  orgId,
  channelName,
  reciverUserId,
) => {
  try {
    var response = await fetch('https://api.intospace.io/chat/team', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: '123456781',
        type: 'DIRECT_MESSAGE',
        orgId: orgId,
        userId: reciverUserId,
      }),
    });
    var result = await response.json();
    if (result?.name == 'GeneralError' || result?.name == 'Conflict') {
    }
    return result;
  } catch (error) {
    console.warn(error);
  }
};

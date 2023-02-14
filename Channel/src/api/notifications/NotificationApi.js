import { call } from 'redux-saga/effects';

export function* notifications({accessToken,deviceId}) {
  try {
    yield call(notificationApi, accessToken,deviceId);
  } catch (error) {
    console.log(error);
  }
}

const notificationApi = async (token, deviceId) => {
    console.log(token,deviceId);
  try {
    var response = await fetch('https://api.intospace.io/users/deviceGroups', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body:JSON.stringify({
        deviceId: {
          chat: deviceId,
        }})
    });
    var result = await response.json();
    console.log(result,"=-=-=-=-");
    return result;
  } catch (error) {
    console.log(error);
  }
};

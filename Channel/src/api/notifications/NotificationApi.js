import {call} from 'redux-saga/effects';

export function* notifications({accessToken, deviceId}) {
  try {
    yield call(notificationApi, accessToken, deviceId);
  } catch (error) {
    console.log(error);
  }
}

const notificationApi = async (token, deviceId) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append(
      'Authorization',
      `${token}`,
    );
    myHeaders.append('Content-Type', 'application/json');

    var raw = JSON.stringify({
      deviceId: {
        chat: `${deviceId}`
      },
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://api.intospace.io/users/deviceGroups', requestOptions)
      .then(response => response.text()).then(result =>console.log(result))
      .catch(error => console.log('error', error));
  } catch (error) {
    console.log(error);
  }
};

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
      'eyJhbGciOiJIUzI1NiIsInR5cCI6ImFjY2VzcyJ9.eyJlbWFpbCI6InJ1ZHJha3Noa2FjaGhhd2FAZ21haWwuY29tIiwiaWF0IjoxNjc0NjM4NTc0LCJleHAiOjE3MDYxOTYxNzQsImF1ZCI6Imh0dHBzOi8veW91cmRvbWFpbi5jb20iLCJpc3MiOiJmZWF0aGVycyIsInN1YiI6ImdNdjVOMEV0RUNtdTRGYTkiLCJqdGkiOiI2ZWQxNWUwOC1lYTFkLTQwNDAtOWQ3Yi03ZjIyZDk5OGUwNTYifQ.JUQf6HMioyPdzRjpL9iqf4YEwZgykJLw-qAJvbV-2yk',
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
      .then(response => response.text())
      .catch(error => console.log('error', error));
  } catch (error) {
    console.log(error);
  }
};

export const sendMessageApi = async (
  message,
  teamId,
  orgId,
  senderId,
  token,
) => {
  console.log(message, teamId, orgId, senderId, token);
  try {
    var response = await fetch('https://api.intospace.io/chat/message', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
        mentions: [],
        teamId: teamId,
        requestId: '73d31f2e-9039-401c-83cd-909953c264f1',
        orgId: orgId,
        senderId: senderId,
        parentId: null,
        createdAt: '2022-05-23T07:02:37.051Z',
        senderType: 'APP',
        appId: '62b53b61b5b4a2001fb9af37',
      }),
    });
    const result = await response.json();
    console.log(result, 'result from the api');
  } catch (error) {
    console.log(error);
  }
};

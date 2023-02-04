export const createChannel = async (token,orgId,channelName) => {
  try {
    var response = await fetch('https://api.intospace.io/chat/team', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: '123456781',
        type: 'PRIVATE',
        orgId: orgId,
        name: channelName,
      }),
    });
    var result = await response.json();
    return result?.orgs;
  } catch (error) {
    console.log(error);
  }
};

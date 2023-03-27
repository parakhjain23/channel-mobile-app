export const resetUnreadCountApi = async (
  orgId,
  userId,
  teamId,
  accessToken,
) => {
  console.log('in api',orgId,userId,teamId,accessToken);

  try {
    var response = await fetch(
      `https://api.intospace.io/chat/teamUser?orgId=${orgId}&userId=${userId}&teamId=${teamId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          unreadCount: 0,
          badgeCount: 0,
        }),
      },
    );
    const result = await response.json();
    console.log(result,'result from the resetunreadcount api ');
    return result;
  } catch (error) {
    console.warn(error,"kjhokhgoihikjhgouihio");
  }
};

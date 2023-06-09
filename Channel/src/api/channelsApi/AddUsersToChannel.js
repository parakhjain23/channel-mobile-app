export const addUsersToChannelApi = async (userIds, teamId, orgId, token) => {
  try {
    const requests = userIds.map(userId =>
      fetch(`https://api.intospace.io/chat/teamUser`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId.userId,
          teamId: teamId,
          orgId: orgId,
        }),
      }).then(response => response.json()),
    );

    const results = await Promise.all(requests);
    return results;
  } catch (error) {
    console.warn(error);
  }
};

export const removeUserFromChannelApi = async (
  userIds,
  teamId,
  orgId,
  token,
) => {
  try {
    const requests = userIds.map(userId =>
      fetch(
        `https://api.intospace.io/chat/teamUser?orgId=${orgId}&userId=${userId.userId}&teamId=${teamId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: token,
            'Content-Type': 'application/json',
          },
        },
      ).then(response => response.json()),
    );

    const results = await Promise.all(requests);
    return results;
  } catch (error) {
    console.warn(error);
  }
};

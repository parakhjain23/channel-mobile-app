export const addUsersToChannelApi = async (userIds,teamId,orgId,token) => {
    console.log(userIds,teamId,orgId,token,"-0-0-0-0-0-");
    try {
      
      var response = await fetch(`https://api.intospace.io/chat/team/${teamId}`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: channelType,
          name: channelName,
          isArchived:true
        }),
      });
      var result = await response.json();
      return result
    } catch (error) {
      console.warn(error);
    }
  };
  
  export const removeUserFromChannelApi = async (userIds,teamId,orgId,token) => {
    console.log(userIds,teamId,orgId,token,"-0-0-0-0-0-");
    try {
      
      var response = await fetch(`https://api.intospace.io/chat/team/${teamId}`, {
        method: 'POST',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: channelType,
          name: channelName,
          isArchived:true
        }),
      });
      var result = await response.json();
      return result
    } catch (error) {
      console.warn(error);
    }
  };
  
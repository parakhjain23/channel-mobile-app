export const getRecenctChannelsApi = async (token, orgId, userId) => {
    console.log('in api calling');
    try {
      var response = await fetch(
        `https://api.intospace.io/chat/teamUser?$sort[lastUpdatedAt]=-1&orgId=${orgId}&userId=${userId}&$paginate=false`,
        {
          method: 'GET',
          headers:{
            Authorization: token,
            'Content-Type': 'application/json'
          },
        },
      );
      const result = await response.json();
      console.log(result,'result from the api');
      return result;
    } catch (error) {
      console.log(error);
    }
  };
  
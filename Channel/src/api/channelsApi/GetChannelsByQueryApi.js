export const getChannelsByQueryApi = async (query, userToken, orgId) => {
  try {
    var response = await fetch(
      `https://delve-api.intospace.io/search/prod-space?query=${query}&API_KEY=TmkzBMbr3Z1eiLjMOQ0kqhqp4f0GVCzR1w&size=15&userToken=${userToken}`,
      {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          terms: {
            type: ['U','T'],
            orgId: [orgId],
          },
          scoreMultiplier: {
            type: {
              values: ['U'],
              weight: 2,
            },
            isEnabled: {
              values: [false],
              weight: 0.25,
            },
            isArchived: {
              values: [true],
              weight: 0.25,
            },
          },
        }),
      },
    );
    const result = await response.json();
    if (result?.hits?.hits) {
      return result?.hits?.hits;
    }
    else{
      return []
    }
  } catch (error) {
    console.warn(error);
  }
};

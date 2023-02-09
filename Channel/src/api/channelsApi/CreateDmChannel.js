import { Alert } from "react-native";

export const createDmChannel = async (token,orgId,channelName,reciverUserId) => {
    console.log(token,orgId,channelName,reciverUserId,"details in crreate API");
  try {
    // console.log('in create channel api', token,orgId,channelName,channelType);
    var response = await fetch('https://api.intospace.io/chat/team', {
      method: 'POST',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requestId: '123456781',
        type: "DIRECT_MESSAGE",
        orgId: orgId,
        name: channelName,
        userId: `${reciverUserId}`
      }),
    });
    var result = await response.json();
    if(result?.name=='GeneralError' || result?.name=='Conflict'){
      Alert.alert(result?.message)
    }
    console.log(result,"this is result");
    return result
  } catch (error) {
    console.log(error);
  }
};

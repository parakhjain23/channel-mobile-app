import { Alert } from "react-native";

export const createChannel = async (token,orgId,channelName,channelType) => {
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
        type: channelType,
        orgId: orgId,
        name: channelName,
      }),
    });
    var result = await response.json();
    if(result?.name=="Conflict"){
      Alert.alert("Channel Already exits");
      return;
    }
    return result
  } catch (error) {
    console.log(error);
  }
};

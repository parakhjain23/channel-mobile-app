import Notifee,{AndroidImportance} from '@notifee/react-native'
import {store} from '../redux/Store';

export const handleNotificationFromEvents = async data => {
  console.log("handleNotificationsfrom events ",data);
  data["mentions"]=`[]`
  data["parentId"]=`${data.parentId}`
  data["showInMainConversation"]=`${data.showInMainConversation}`
  data["isLink"]=`${data.isLink}`
  var channelType = store.getState().channelsReducer?.teamIdAndTypeMapping[data?.teamId]
    var title 
    var body
    console.log(data,"=-=-=-=-this is data-=-=-=-");
    if(channelType == 'DIRECT_MESSAGE'){
      title = store.getState().orgsReducer?.userIdAndNameMapping[data?.senderId]
      body = data?.content
    }else if(channelType == 'PUBLIC' || channelType == 'PRIVATE' || channelType == 'DEFAULT'){
      title = store.getState().channelsReducer?.teamIdAndNameMapping[data?.teamId]
      body = store.getState().orgsReducer?.userIdAndNameMapping[data.senderId] + " : "+ data?.content
    }
    await Notifee.displayNotification({
      title: title,
      body: body,
      id: 'foreground',
      data: data,
      android: {
        channelId: 'foreground',
        // smallIcon: '@mipmap/ic_launcher',
        // largeIcon: 'https://control.msg91.com/app/assets/images/logo.png',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default' 
        },
        actions: [
          {
            title: 'Mark as Read',
            pressAction: {
              id: 'mark_as_read',
            },
          },
          {
            title: 'Reply',
            pressAction: {
              id: 'reply',
            },
            input: true,
          },
        ],
      },
    });
  };
  export const handleNotificationFirebase = async firebaseData => {
    console.log("handleNotificationsFIREBASE data",firebaseData);
    var title = firebaseData?.notification?.title
    var body = firebaseData?.notification?.body
    await Notifee.displayNotification({
      title: title,
      body: body,
      id: 'fcm_channel',
      data: firebaseData?.data,
      android: {
        channelId: 'fcm_channel',
        // smallIcon: '@mipmap/ic_launcher',
        // largeIcon: 'https://control.msg91.com/app/assets/images/logo.png',
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
          launchActivity: 'default' 
        },
        actions: [
          {
            title: 'Mark as Read',
            pressAction: {
              id: 'mark_as_read',
            },
          },
          {
            title: 'Reply',
            pressAction: {
              id: 'reply',
            },
            input: true,
          },
        ],
      },
    });
  };
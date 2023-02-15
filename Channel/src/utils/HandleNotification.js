import Notifee,{AndroidImportance} from '@notifee/react-native'
import {store} from '../redux/Store';

export const handleNotificationFromEvents = async data => {
  console.log("handleNotificationsfrom events ",data);
    var title 
    var body
    if(data?.receiver){
     title  =  store.getState().orgsReducer?.userIdAndNameMapping[data.senderId]
     body = data?.content
    }else{
      title = store.getState().channelsReducer?.teamIdAndNameMapping[data?.teamId]
      body = store.getState().orgsReducer?.userIdAndNameMapping[data.senderId] + " : "+ data?.content 
    }
    // var title  =  store.getState().orgsReducer?.userIdAndNameMapping[data.senderId]
    await Notifee.displayNotification({
      title: title,
      body: body,
      id: 'foreground',
      data: {teamId : data?.teamId , name : `${title}`},
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
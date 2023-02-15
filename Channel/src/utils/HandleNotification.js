import Notifee,{AndroidImportance} from '@notifee/react-native'
import {store} from '../redux/Store';

export const handleNotificationFromEvents = async data => {
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
      data: {name : 'rudraksh'},
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
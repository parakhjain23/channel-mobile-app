import Notifee, {AndroidImportance} from '@notifee/react-native';
import {store} from '../redux/Store';

export const handleNotificationFromEvents = async data => {
  data['attachment']=`${data?.attachment}`
  data['isActivity']=data?.isActivity != undefined ? `${data?.isActivity}` :'false'
  data['mentions'] = `[]`;
  data['showInMainConversation'] = `${data?.showInMainConversation}`;
  data['isLink'] = `${data?.isLink}`;
  data['parentId'] == null
    ? delete data['parentId']
    : (data['parentId'] = `${data?.parentId}`);
  var channelType =
    store.getState().channelsReducer?.teamIdAndTypeMapping[data?.teamId];
  var title;
  var body;
  var activityContent;
  if (channelType == 'DIRECT_MESSAGE') {
    title = store.getState().orgsReducer?.userIdAndNameMapping[data?.senderId];
    if(data['isActivity']=='true'){
      const regex = /\{\{(\w+)\}\}/g;
       activityContent  = data?.content?.replace(regex, (match, userId) => {
        return store?.getState()?.orgsReducer?.userIdAndNameMapping[userId] || match; // return the name if it exists, or the original match if not 
          })  
      body = activityContent    
    }else{
      body = data?.content;
    }
  } else{
    title =
      store.getState().channelsReducer?.teamIdAndNameMapping[data?.teamId];
      if(data['isActivity']=='true'){
        const regex = /\{\{(\w+)\}\}/g;
       activityContent  = data?.content?.replace(regex, (match, userId) => {
        return store?.getState()?.orgsReducer?.userIdAndNameMapping[userId] || match; // return the name if it exists, or the original match if not 
          })  
        body =  store.getState().orgsReducer?.userIdAndNameMapping[data.senderId] +
        ' : ' + activityContent
        }else{
          body =
          store.getState().orgsReducer?.userIdAndNameMapping[data.senderId] +
          ' : ' +
          data?.content;
        }
  }
  await Notifee.displayNotification({
    title: title,
    body: body,
    id: 'foreground',
    data: data,
    android: {
      channelId: 'foreground',
      // smallIcon: '@mipmap/ic_launcher',
      largeIcon: require('../assests/images/appIcon/icon.png'),
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
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
    ios: {
      // Two actions (Mark as Read and Reply) for iOS
      // The first action will be displayed as a default action when the notification is displayed
      // The second action will be displayed as a "destructive" action (in red) when the user swipes the notification to the left
      // You can customize the titles and the IDs of the actions to match your needs
      attachments: [
        {
          url: 'https://s3.ap-south-1.amazonaws.com/walkover.things-of-brand.assets/2b4c042bbe9ec62b13f698f163434389',
          identifier: 'mark_as_read',
          title: 'Mark as Read',
          options: {
            type: 'default',
          },
        },
        {
          url: 'https://s3.ap-south-1.amazonaws.com/walkover.things-of-brand.assets/2b4c042bbe9ec62b13f698f163434389',
          identifier: 'reply',
          title: 'Reply',
          options: {
            type: 'destructive',
          },
        },
      ],
      categoryId: 'channel'
    },
  });
};
export const handleNotificationFirebase = async firebaseData => {
  var title = firebaseData?.notification?.title;
  var body = firebaseData?.notification?.body;
  await Notifee.displayNotification({
    title: title,
    body: body,
    id: 'fcm_channel',
    data: firebaseData?.data,
    android: {
      channelId: 'fcm_channel',
      // smallIcon: '@mipmap/ic_launcher',
      largeIcon: require('../assests/images/appIcon/icon.png'),
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: 'default',
        launchActivity: 'default',
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
    ios: {
      // Two actions (Mark as Read and Reply) for iOS
      // The first action will be displayed as a default action when the notification is displayed
      // The second action will be displayed as a "destructive" action (in red) when the user swipes the notification to the left
      // You can customize the titles and the IDs of the actions to match your needs
      attachments: [
        {
          url: 'https://control.msg91.com/app/assets/images/logo.png',
          identifier: 'mark_as_read',
          title: 'Mark as Read',
          options: {
            type: 'default',
          },
        },
        {
          url: 'https://control.msg91.com/app/assets/images/logo.png',
          identifier: 'reply',
          title: 'Reply',
          options: {
            type: 'destructive',
          },
        },
      ],
    },
  });
};

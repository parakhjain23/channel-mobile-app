import Notifee, {AndroidImportance} from '@notifee/react-native';
import {store} from '../redux/Store';

export const handleNotificationFromEvents = async data => {
  console.log('handleNotificationsfrom events ', data);
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
  if (channelType == 'DIRECT_MESSAGE') {
    title = store.getState().orgsReducer?.userIdAndNameMapping[data?.senderId];
    body = data?.content;
  } else if (
    channelType == 'PUBLIC' ||
    channelType == 'PRIVATE' ||
    channelType == 'DEFAULT'
  ) {
    title =
      store.getState().channelsReducer?.teamIdAndNameMapping[data?.teamId];
    body =
      store.getState().orgsReducer?.userIdAndNameMapping[data.senderId] +
      ' : ' +
      data?.content;
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
          url: 'https://com.channel/mark_as_read',
          identifier: 'mark_as_read',
          title: 'Mark as Read',
          options: {
            type: 'default',
          },
        },
        {
          url: 'https://com.channel/reply',
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
export const handleNotificationFirebase = async firebaseData => {
  console.log('handleNotificationsFIREBASE data', firebaseData);
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
          identifier: 'mark_as_read',
          title: 'Mark as Read',
          options: {
            type: 'default',
          },
        },
        {
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

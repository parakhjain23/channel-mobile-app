import { useEffect } from "react";
import Notifee,{AndroidImportance,AndroidVisibility} from '@notifee/react-native'
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {subscribeToNotifications} from '../redux/actions/socket/socketActions';
import {store} from '../redux/Store';
import { handleNotificationFirebase } from "./HandleNotification";
import * as RootNavigation from '../navigation/RootNavigation';
import { sendMessageStart } from "../redux/actions/chat/ChatActions";



const NotificationSetup =()=>{
    useEffect(() => {
        setNotificationListeners();
        initPushNotification();
      }, [store.getState()?.userInfoReducer?.accessToken]);
      const initPushNotification = async () => {
        try {
          await Notifee.requestPermission();
          await Notifee.createChannel({
            id: 'fcm_channel',
            importance: AndroidImportance.HIGH,
            name: 'fcm_channel',
            lights: true,
            sound: 'default',
            vibration: true,
            visibility: AndroidVisibility.PUBLIC,
          });
          const isPresent = await Notifee.isChannelCreated('foreground');
          if (!isPresent) {
            await Notifee.createChannel({
              id: 'foreground',
              importance: AndroidImportance.HIGH,
              name: 'foreground',
              lights: true,
              sound: 'default',
              vibration: true,
              visibility: AndroidVisibility.PUBLIC,
            });
          }
        } catch (error) {}
      };
      const setNotificationListeners = async () => {
        try {
          const token = await messaging().getToken();
          await AsyncStorage.setItem('FCM_TOKEN', token);
          await AsyncStorage.getItem('FCM_TOKEN').then(token => {
            if (store.getState().userInfoReducer?.accessToken) {
              store.dispatch(subscribeToNotifications(store.getState().userInfoReducer?.accessToken, token));
            }
          });
          messaging().onTokenRefresh(async token => {
            if (token) {
              await AsyncStorage.setItem('FCM_TOKEN', token.token);
            }
          });
          messaging().onMessage(async message => {
            if (message?.data?.senderId != store.getState()?.userInfoReducer.user?.id) {
              handleNotificationFirebase(message);
            }
          });
          messaging().onNotificationOpenedApp(message => {
            openChat(message);
          });
          messaging().setBackgroundMessageHandler(async message => {
            if (message?.data?.senderId != store.getState()?.userInfoReducer?.user?.id) {
              handleNotificationFirebase(message);
            }
          });
          const rMessage = await messaging().getInitialNotification();
          if (rMessage) {
            openChat(rMessage);
          }
          const categories = [
            {
              id: 'channel',
              actions: [
                {
                  id: 'mark_as_read',
                  title: 'Mark as Read',
                  options: {
                    foreground: true,
                    authenticationRequired: false,
                    destructive: false,
                  },
                },
                {
                  id: 'reply',
                  title: 'Reply',
                  input: true,
                  options: {
                    foreground: true,
                    authenticationRequired: false,
                    destructive: true,
                  },
                  textInput: {
                    buttonTitle: 'Send',
                    placeholder: 'Type a message',
                  },
                },
              ],
            },
          ];
          
          Notifee.setNotificationCategories(categories);
          Notifee.onForegroundEvent(actionListeners);
          Notifee.onBackgroundEvent(actionListeners);
        } catch (error) {
          console.log(error, 'this is error');
        }
      };
      const actionListeners = async event => {
        if (event?.type == 1) {
          const message = event?.detail?.notification;
          console.log(message,"this is message in open chat");
          openChat(message);
        }
        switch (event?.detail?.pressAction?.id) {
          case 'mark_as_read':
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          case 'reply':
            var message = event?.detail?.input;
            var teamId = event?.detail?.notification?.data?.teamId;
            var orgId = event?.detail?.notification?.data?.orgId;
            var senderId = event?.detail?.notification?.data?.senderId;
            var token = store.getState().userInfoReducer?.accessToken;
            var parentId = event?.detail?.notification?.data?.parentId;
            store.dispatch(
              sendMessageStart(message, teamId, orgId, senderId, token, parentId),
            );
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          default:
            break;
        }
      };
      const openChat = message => {
        try {
          var teamId = message?.data?.teamId;
          var name = null;
            store.getState()?.channelsReducer?.teamIdAndTypeMapping[teamId] == 'DIRECT_MESSAGE'
            ? (name = store.getState().orgsReducer?.userIdAndNameMapping[message?.data?.senderId])
            : (name =  store.getState()?.channelsReducer?.teamIdAndNameMapping[teamId]);
          RootNavigation?.navigate('Chat', {chatHeaderTitle: name, teamId: teamId});
        } catch (error) {
          console.log(error);
        }
      };
      return null
}
export default NotificationSetup
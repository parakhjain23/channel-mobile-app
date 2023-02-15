import React, {useEffect, useState} from 'react';
import {connect, Provider, useDispatch} from 'react-redux';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWraper';
import Notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToNotifications } from '../redux/actions/socket/socketActions';
import { handleNotificationFirebase } from '../utils/HandleNotification';
import { openChat } from './ProtectedNavigation';
import * as RootNavigation from '../navigation/RootNavigation'

const StoreAppWrapper = ({userInfoState}) => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
    const dispatch = useDispatch()
    // const navigation = useNavigation()
    useEffect(() => {
        setNotificationListeners();
        initPushNotification();
      },[userInfoState?.accessToken]) 
      const initPushNotification = async () => {
        try {
          await Notifee.requestPermission()
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
       
        } catch (error) { }
      };
      const setNotificationListeners = async () => {
        try {
          const token = await messaging().getToken()
          await AsyncStorage.setItem('FCM_TOKEN',token)
          await AsyncStorage.getItem('FCM_TOKEN').then(token=>{
            if(userInfoState?.accessToken){
                dispatch(subscribeToNotifications(userInfoState?.accessToken,token))
            }
          })
          messaging().onTokenRefresh(async token => {
            if (token) {
              await AsyncStorage.setItem('FCM_TOKEN', token.token);
            }
          });
          messaging().onMessage(async message => {
            console.log('OnMessage Receivedddddddddddd app is in foreground but socket is disconnect', message);
            handleNotificationFirebase(message)
            // store.dispatch(HandleNotification(message));
          });
          messaging().onNotificationOpenedApp(message => {
            openChat(message);
            console.log("open appp on clicking on notification");
          });
          messaging().setBackgroundMessageHandler(async message => {
            console.log('background message Received by firebase',message);
            handleNotificationFirebase(message)
          });
          const rMessage = await messaging().getInitialNotification();
          if (rMessage) {
            openChat(rMessage);
            console.log("open app notification from firebase");
          }
          Notifee.onForegroundEvent(actionListeners);
          Notifee.onBackgroundEvent(actionListeners);
        } catch (error) { 
            console.log(error,"this is error");
        }
      };
      const actionListeners = async event => {
        if (event.type == 1) {
          const message = event.detail.notification;
          openChat(message);
        }
        switch (event?.detail?.pressAction?.id) {
          case 'mark_as_read':
            console.log('mark as read');
            // store.dispatch(MarkAsRead(params.chatId));
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          case 'reply':
            console.log('reply');
            // store.dispatch(reply(params.chatId, event?.detail?.input));
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          default:
            break;
        }
      };
      const openChat = (message)=>{
        try {
          RootNavigation?.navigate('Chat',{chatHeaderTitle: message?.data?.name, teamId: message?.data?.teamId})
        } catch (error) {
          console.log(error);
        }
      }
  return showSplashScreen ? (
    <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AppWrapper/>
  
  );
};
const mapStateToProps = state =>{
  return {
    userInfoState : state.userInfoReducer
  }
}
export default connect(mapStateToProps)(StoreAppWrapper);
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
import { sendMessageStart } from '../redux/actions/chat/ChatActions';
import { store } from '../redux/Store';

const StoreAppWrapper = ({userInfoState,channelsState,orgsState}) => {
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
            if(message?.data?.senderId != userInfoState?.user?.id){
              handleNotificationFirebase(message)
            }
            // store.dispatch(HandleNotification(message));
          });
          messaging().onNotificationOpenedApp(message => {
            openChat(message);
            console.log("open appp on clicking on notification");
          });
          messaging().setBackgroundMessageHandler(async message => {
            console.log('background message Received by firebase',message);
            if(message?.data?.senderId != userInfoState?.user?.id){
              handleNotificationFirebase(message)
            }
          });
          const rMessage = await messaging().getInitialNotification();
          if (rMessage) {
            console.log(rMessage,"this is rmessage");
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
        console.log(event,"this is event in action listeners functions978787878787878");
        if (event.type == 1) {
          const message = event.detail.notification;
          openChat(message);
        }
        switch (event?.detail?.pressAction?.id) {
          case 'mark_as_read':
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          case 'reply':
            var message = event.detail.input
            var teamId = event.detail.notification?.data?.teamId
            var orgId = event.detail.notification?.data?.orgId
            var senderId = event.detail.notification?.data?.senderId
            var token = userInfoState?.accessToken
            var parentId = event?.detail?.notification?.data?.parentId
            store.dispatch(sendMessageStart(message,teamId,orgId,senderId,token,parentId));
            Notifee.cancelNotification(event?.detail?.notification?.id);
            break;
          default:
            break;
        }
      };
      const openChat = (message)=>{
        try {
          console.log(message,"in OPEN CHAT");
          var teamId = message?.data?.teamId
          var name
          channelsState?.teamIdAndTypeMapping[teamId] == 'DIRECT_MESSAGE' ? name= orgsState?.userIdAndNameMapping[message?.data?.senderId] :
          name = channelsState?.teamIdAndNameMapping[teamId]
          // var name = message?.data?.name ? message?.data?.name : channelsState?.teamIdAndNameMapping[teamId]
          RootNavigation?.navigate('Chat',{chatHeaderTitle: name, teamId: teamId})
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
    userInfoState : state.userInfoReducer,
    channelsState : state.channelsReducer,
    orgsState : state.orgsReducer
  }
}
export default connect(mapStateToProps)(StoreAppWrapper);
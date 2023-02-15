import React, { useEffect } from 'react'
import AuthNavigation from './AuthNavigation';
import Notifee, {
    AndroidImportance,
    AndroidVisibility,
  } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect, useDispatch } from 'react-redux';
import { subscribeToNotifications } from '../redux/actions/socket/socketActions';

const AppWrapper = ({userInfoState}) => {
    // const dispatch = useDispatch()
    // useEffect(() => {
    //     setNotificationListeners();
    //     initPushNotification();
    //   },[])
    //   const initPushNotification = async () => {
    //     console.log("inside init push notification");
    //     try {
    //       await Notifee.requestPermission()
    //       await Notifee.deleteChannel('fcm_channel');
    //       await Notifee.createChannel({
    //         id: 'fcm_channel',
    //         importance: AndroidImportance.HIGH,
    //         name: 'fcm_channel',
    //         lights: true,
    //         sound: 'default',
    //         vibration: true,
    //         visibility: AndroidVisibility.PUBLIC,
    //       });
    //       const isPresent = await Notifee.isChannelCreated('foreground');
    //       if (!isPresent) {
    //         await Notifee.createChannel({
    //           id: 'foreground',
    //           importance: AndroidImportance.HIGH,
    //           name: 'foreground',
    //           lights: true,
    //           sound: 'default',
    //           vibration: true,
    //           visibility: AndroidVisibility.PUBLIC,
    //         });
    //       }
    //     } catch (error) { }
    //   };
    //   const setNotificationListeners = async () => {
    //     try {
    //       const token = await messaging().getToken()
    //       await AsyncStorage.setItem('FCM_TOKEN',token)
    //       await AsyncStorage.getItem('FCM_TOKEN').then(token=>{
    //         if(userInfoState?.accessToken){
    //             dispatch(subscribeToNotifications(userInfoState?.accessToken,token))
    //         }
    //       })
    //       messaging().onTokenRefresh(async token => {
    //         if (token) {
    //           await AsyncStorage.setItem('FCM_TOKEN', token.token);
    //         }
    //       });
    //       messaging().onMessage(async message => {
    //         console.log('OnMessage Receivedddddddddddd', message);
    //         // store.dispatch(HandleNotification(message));
    //       });
    //       messaging().onNotificationOpenedApp(message => {
    //         // openChat(message);
    //         console.log("open appp");
    //       });
    //       messaging().setBackgroundMessageHandler(async message => {
    //         console.log('backg Received');
    //         // dispatchHandleNotification(message);
    //       });
    //       const rMessage = await messaging().getInitialNotification();
    //       if (rMessage) {
    //         // openChat(rMessage);
    //         console.log("open app notification from firebase");
    //       }
    //       // Notifee.onForegroundEvent(actionListeners);
    //       // Notifee.onBackgroundEvent(actionListeners);
    //     } catch (error) { 
    //         console.log(error,"this is error");
    //     }
    //   };
    return (
        <AuthNavigation />
    )
}
const mapStateToProps = state =>{
    return{
        userInfoState : state.userInfoReducer
    }
}
export default connect(mapStateToProps)(AppWrapper);
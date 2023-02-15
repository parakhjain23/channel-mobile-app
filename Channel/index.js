/**
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppRegistry} from 'react-native';
import PushNotification from 'react-native-push-notification';
import App from './App';
import {name as appName} from './app.json';
import PushNotificationIOS from '@react-native-community/push-notification-ios'

PushNotification.configure({
  onRegister: function (token) {
    console.log(token);
    AsyncStorage.setItem('FCM_TOKEN', JSON.stringify(token.token));
  },
  onNotification: function (notification) {
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onRegistrationError: function (err) {
    console.warn(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});
AppRegistry.registerComponent(appName, () => App);

// AsyncStorage.clear()
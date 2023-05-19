/**
 * @format
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import AppSentry from './AppSentry';
if (__DEV__) {
  AppRegistry.registerComponent(appName, () => App);
} else {
  AppRegistry.registerComponent(appName, () => AppSentry);
}

AsyncStorage.clear()
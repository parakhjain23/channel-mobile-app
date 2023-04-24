// import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/lib/integration/react';
import StoreAppWrapper from './src/navigation/StoreAppWrapper';
import {persistor, store} from './src/redux/Store';
import Notifee from '@notifee/react-native';
import NotificationSetup from './src/utils/NotificationSetup';
import InternetConnection from './src/utils/InternetConnection';
import SplashScreen from 'react-native-splash-screen';
import * as Sentry from '@sentry/react-native';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    Request();
    Sentry.init({
      dsn: 'https://b3b078bd820c4f6cb1e948fd23c46d59@o4504117127348224.ingest.sentry.io/4505068327075840',
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
      // enableNative: false
    });
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <InternetConnection />
        <NotificationSetup />
        <StoreAppWrapper />
      </PersistGate>
    </Provider>
  );
};
export default Sentry.wrap(App);

async function Request() {
  await Notifee.requestPermission({
    alert: true,
  });
}

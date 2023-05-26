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
import RNUxcam from 'react-native-ux-cam';

const App = () => {
  useEffect(() => {
    SplashScreen.hide();
    Request();
    EnableUXCam();
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
export default App;

async function Request() {
  await Notifee.requestPermission({
    alert: true,
  });
}

async function EnableUXCam() {
  try {
    RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
    const configuration = {
      userAppKey: 'jisbwnbf3x2d308',
      enableAutomaticScreenNameTagging: false,
      enableAdvancedGestureRecognition: true, // default is true
      enableImprovedScreenCapture: true, // for improved screen capture on Android
      // occlusions?: UXCamOcclusion[],
    };
    RNUxcam.startWithConfiguration(configuration);
  } catch (error) {
    console.log(error, 'error while enabling UXCam');
  }
}

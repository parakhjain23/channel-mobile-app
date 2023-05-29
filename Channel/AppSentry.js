import React, {useEffect} from 'react';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from 'react-native-error-boundary';
import App from './App';
import ErrorScreen from './src/screens/errorScreen/ErrorScreen';
import RNUxcam from 'react-native-ux-cam';

const AppSentry = () => {
  useEffect(() => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
    });
    EnableUXCam();
  });

  return <ErrorBoundary FallbackComponent={ErrorScreen} children={<App />} />;
};

async function EnableUXCam() {
  try {
    RNUxcam.optIntoSchematicRecordings(); // Add this line to enable iOS screen recordings
    const configuration = {
      userAppKey: process.env.UXCAM_APP_KEY,
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
export default Sentry.wrap(AppSentry);

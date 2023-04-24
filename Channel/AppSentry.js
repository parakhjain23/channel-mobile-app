import React, {useEffect} from 'react';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from 'react-native-error-boundary';
import App from './App';
import ErrorScreen from './src/screens/errorScreen/ErrorScreen';

const AppSentry = () => {
  useEffect(() => {
    Sentry.init({
      dsn: 'https://b3b078bd820c4f6cb1e948fd23c46d59@o4504117127348224.ingest.sentry.io/4505068327075840',
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
    });
  });

  return <ErrorBoundary FallbackComponent={ErrorScreen} children={<App />} />;
};

export default Sentry.wrap(AppSentry);

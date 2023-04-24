import React, {useEffect} from 'react';
import * as Sentry from '@sentry/react-native';
import ErrorBoundary from 'react-native-error-boundary';
import App from './App';
import ErrorScreen from './src/screens/errorScreen/ErrorScreen';

const AppSentry = () => {
  useEffect(() => {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
    });
  });

  return <ErrorBoundary FallbackComponent={ErrorScreen} children={<App />} />;
};

export default Sentry.wrap(AppSentry);

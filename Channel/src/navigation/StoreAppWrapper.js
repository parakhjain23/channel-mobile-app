import React, {useState} from 'react';
import {persistor, store} from '../redux/Store';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWrapper';

const StoreAppWrapper = () => {
  console.log('Inside StoreAppWrapper');
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {showSplashScreen ? (
          <SplashScreen setShowSplashScreen={setShowSplashScreen} />
        ) : (
          <AppWrapper />
        )}
      </PersistGate>
    </Provider>
  );
};

export default StoreAppWrapper;

import React, {useState} from 'react';
import {persistor, store} from '../redux/Store';
import {Provider} from 'react-redux';
// import AppWrapper from './appWrapper.js';
import {PersistGate} from 'redux-persist/integration/react';
import { Text } from 'react-native';
import SplashScreen from '../screens/splashScreen/SplashScreen';
const StoreAppWrapper = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {showSplashScreen ? (
          <SplashScreen setShowSplashScreen={setShowSplashScreen} />
        ) : (
          <Text>In application{console.log('in store')}</Text>
        )}
      </PersistGate>
    </Provider>
  );
};

export default StoreAppWrapper;

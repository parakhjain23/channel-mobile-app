import React, { useState} from 'react';
import SplashScreen from '../screens/splashScreen/SplashScreen';
import AppWrapper from './AppWraper';


const StoreAppWrapper = () => {
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  return showSplashScreen ? (
    <SplashScreen setShowSplashScreen={setShowSplashScreen} />
  ) : (
      <AppWrapper />
  );
};
export default (StoreAppWrapper);

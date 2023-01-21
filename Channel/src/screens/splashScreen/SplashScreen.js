import React, {useEffect} from 'react';
import {Text, View} from 'react-native';

const SplashScreen = ({setShowSplashScreen}) => {
  console.log('in splash screen');
  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 2000);
  });
  return (
    <View>
      <Text>In splashScreen</Text>
    </View>
  );
};

export default SplashScreen;

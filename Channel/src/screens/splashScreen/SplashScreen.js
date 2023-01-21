import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';

const SplashScreen = ({setShowSplashScreen}) => {
  console.log('in splash screen');
  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 2000);
  });
  return (
    <View style={{flex:1,justifyContent:'center'}}>
      <Text style={{textAlign:'center'}}>In splashScreen</Text>
    </View>
  );
};

export default SplashScreen;

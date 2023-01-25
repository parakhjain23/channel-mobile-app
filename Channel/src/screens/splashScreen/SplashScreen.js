import React, {useEffect} from 'react';
import {Image, Text, View} from 'react-native';

const SplashScreen = ({setShowSplashScreen}) => {
  useEffect(() => {
    setTimeout(() => {
      setShowSplashScreen(false);
    }, 1000);
  });
  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Image source={require('../../assests/images/appIcon/icon-96x96.png')}/>
      <Text style={{textAlign:'center'}}>Channel by Space</Text>
    </View>
  );
};

export default SplashScreen;

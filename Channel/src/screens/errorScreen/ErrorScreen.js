import React, {useEffect} from 'react';
import {Text, View} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sentry from '@sentry/react-native';
import {ms} from 'react-native-size-matters';
import AnimatedLottieView from 'lottie-react-native';

const ErrorScreen = () => {
  const message1 = 'Encountered an error,',
    message2 = 'Please try again later.';
  useEffect(() => {
    AsyncStorage.clear();
    setTimeout(() => {
      Sentry.nativeCrash();
    }, 3500);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'white',
      }}>
      <AnimatedLottieView
        source={require('../../assests/images/attachments/error.json')}
        loop
        autoPlay
        style={{height: ms(100), width: ms(100)}}
      />
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'OpenSans-Regular',
          color: 'black',
          marginBottom: 10,
        }}>
        {message1}
      </Text>
      <Text
        style={{fontSize: 16, fontFamily: 'OpenSans-Regular', color: 'black'}}>
        {message2}
      </Text>
    </View>
  );
};
export default ErrorScreen;

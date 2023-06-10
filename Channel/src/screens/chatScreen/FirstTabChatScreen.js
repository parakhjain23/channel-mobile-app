import {View, Text, Image} from 'react-native';
import React from 'react';
import {useTheme} from '@react-navigation/native';

const FirstTabChatScreen = () => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primaryColor,
      }}>
      <Image source={require('../../assests/images/appIcon/icon72size.png')} />
      <Text style={{color: colors?.color, fontSize: 18, fontWeight: '500'}}>
        Welcome To channel
      </Text>
      <Text style={{color: colors?.color}}>You Are Awesome :)</Text>
    </View>
  );
};

export default FirstTabChatScreen;

import {View, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '@react-navigation/native';

const NoInternetComponent = () => {
  const {colors} = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        padding: 15,
      }}>
      <Icon name="wifi" size={20} color={colors.color} />
      <Text style={{textAlign: 'justify', color: colors.color}}>
        Low Internet{'\n'}Please Check you Internet Connection{'\n'}Restart the application
      </Text>
    </View>
  );
};

export default NoInternetComponent;

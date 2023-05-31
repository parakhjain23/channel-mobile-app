import {View, Text, RefreshControl} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useTheme} from '@react-navigation/native';
import {ScrollView} from 'react-native';

const NoInternetComponent = ({refreshing, onRefresh}) => {
  const {colors} = useTheme();

  return (
    <ScrollView
      style={{
        marginHorizontal: 20,
        flex: 1,
      }}
      contentContainerStyle={{
        justifyContent: 'center',
        flex: 1,
      }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
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
          Low Internet{'\n'}Please Check your Internet Connection{'\n'}Restart
          the application
        </Text>
      </View>
    </ScrollView>
  );
};

export default NoInternetComponent;

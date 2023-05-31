import {useNavigation} from '@react-navigation/native';
import React, {useRef} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {s,ms,mvs} from 'react-native-size-matters';

const NoChannelsFound = ({modalizeRef, setsearchValue, props}) => {
  const navigation = useNavigation();
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={{alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={[styles.centerText, {fontSize: 18}]}>
          No channels found
        </Text>
        <TouchableOpacity
          onPress={() => {
            setsearchValue('');
            navigation.navigate('Explore Channels', {props: props});
          }}>
          <Text
            style={[
              styles.centerText,
              {fontSize: (20), color: 'hsl(206,100%,40%)', margin: 5},
            ]}>
            Explore All Channels
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setsearchValue('');
            modalizeRef?.current?.open();
          }}>
          <Text
            style={[
              styles.centerText,
              {fontSize: (20), color: 'hsl(206,100%,40%)', margin: 5},
            ]}>
            Create New Channel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default NoChannelsFound;
const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  centerText: {
    textAlign: 'center',
  },
});

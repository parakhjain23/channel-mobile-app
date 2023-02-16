import React, {useRef} from 'react';
import {Button, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import ExploreChannels from './ExploreChannels';

const NoChannelsFound = props => {

  return (
    <View style={{flex:1,justifyContent:'center'}}>
      <View style={{alignSelf: 'center'}}>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          No channels found
        </Text>
        <Button title="Explore All Channels" onPress={()=>{}} />
        <Button
          title="Create New Channel"
          onPress={() => props?.modalizeRef?.current?.open()}
        />
      </View>
      <ExploreChannels />
    </View>
  );
};
export default NoChannelsFound;

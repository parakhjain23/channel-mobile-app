import { useNavigation } from '@react-navigation/native';
import React, {useRef} from 'react';
import {Button, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';

const NoChannelsFound = ({modalizeRef,props}) => {
  const navigation = useNavigation()
  // const modalizeRef = useRef(null);

  // const ExploreChannelModal = ({modalizeRef}) => {
  //   console.log('in explore');
  //   return (
  //     <Modalize
  //       scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
  //       ref={modalizeRef}
  //       modalStyle={{top: '12%'}}>
  //       <View style={{margin: 12}}>
  //         <Text>hello</Text>
  //       </View>
  //     </Modalize>
  //   );
  // };
  // const onOpen = () => {
  //   console.log('in onopen');
  //   modalizeRef?.current?.open();
  // };
  return (
    <View style={{flex:1,justifyContent:'center'}}>
      <View style={{alignSelf: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          No channels found
        </Text>
        <Button title="Explore All Channels" onPress={()=>navigation.navigate('ExploreChannels',{props:props})} />
        <Button
          title="Create New Channel"
          onPress={() => modalizeRef?.current?.open()}
        />
      </View>
      {/* <ExploreChannelModal modalizeRef={modalizeRef} /> */}
    </View>
  );
};
export default NoChannelsFound;

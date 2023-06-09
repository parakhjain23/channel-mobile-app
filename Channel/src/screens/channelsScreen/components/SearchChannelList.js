import React from 'react';
import {FlatList} from 'react-native';
import {useCallback} from 'react';
import {RenderSearchChannels} from '../ChannelCard';
import {View} from 'react-native';

const SearchChannelListComponent = ({props, navigation}) => {
  const renderItemSearchChannels = useCallback(
    ({item}) => {
      if (
        item?._source?.type === 'T' &&
        item?._source?.status === 'PRIVATE' &&
        props?.channelsState?.teamIdAndTypeMapping[item?._source?.id] ===
          undefined
      ) {
        return null; // Do not render the component
      }
      return (
        <RenderSearchChannels
          item={item}
          navigation={navigation}
          props={props}
        />
      );
    },
    [props?.channelsByQueryState],
  );
  return (
    <View style={{flex: 1}}>
      <FlatList
        data={props?.channelsByQueryState?.channels}
        renderItem={renderItemSearchChannels}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
      />
    </View>
  );
};

export default SearchChannelList = React.memo(SearchChannelListComponent);

import React from 'react';
import {Animated, FlatList} from 'react-native';
import {useCallback} from 'react';
import {RenderChannels, RenderSearchChannels} from '../ChannelCard';
import {View} from 'react-native';
import {RefreshControl} from 'react-native';

const RecentChannelsListComponent = ({
  props,
  navigation,
  onScroll,
  onRefresh,
  refreshing,
}) => {
  const renderItemChannels = useCallback(
    ({item, index}) => {
      return (
        !item?.isArchived && (
          <RenderChannels item={item} navigation={navigation} props={props} />
        )
      );
    },
    [
      props?.channelsState?.channels,
      props?.channelsState,
      props?.orgsState?.userIdAndNameMapping,
    ],
  );
  return (
    <View style={{flex: 1}}>
      <Animated.FlatList
        data={
          props?.channelsState?.recentChannels || props?.channelsState?.channels
        }
        renderItem={renderItemChannels}
        onScroll={onScroll}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
};

export default RecentChannelsList = React.memo(RecentChannelsListComponent);

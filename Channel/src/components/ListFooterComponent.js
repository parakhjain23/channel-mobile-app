import React, {useCallback} from 'react';
import {ActivityIndicator} from 'react-native';

const ListFooterComponent = () => {
  return <ActivityIndicator size={'small'} />;
};

export default React.memo(ListFooterComponent);

import React from 'react';
import {Text} from 'react-native';
import {Animated, TouchableOpacity} from 'react-native';
const RightSwipeActionComponent = ({
  scale,
  item,
  closeChannelAction,
  markAsUnreadAction,
  props,
  Name,
  swipeableRef,
}) => {
  return (
    <Animated.View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transform: [{scale}],
      }}>
      {item?.type != 'DIRECT_MESSAGE' &&
        item?.type != 'DEFAULT' &&
        item?.type != 'PERSONAL' && (
          <TouchableOpacity
            style={{
              backgroundColor: '#f44336',
              justifyContent: 'center',
              paddingHorizontal: 15,
              height: '100%',
            }}
            onPress={() => {
              closeChannelAction(
                Name,
                item?._id,
                item?.type,
                props?.userInfoState?.accessToken,
              ),
                swipeableRef?.current?.close();
            }}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                fontSize: 14,
                textAlign: 'center',
              }}>
              Close{'\n'}Channel
            </Text>
          </TouchableOpacity>
        )}
      {props?.channelsState?.teamIdAndBadgeCountMapping[item?._id] == 0 && (
        <TouchableOpacity
          style={{
            backgroundColor: '#ff9800',
            justifyContent: 'center',
            paddingHorizontal: 15,
            height: '100%',
          }}
          onPress={() => {
            markAsUnreadAction(
              item?.orgId,
              props?.userInfoState?.user?.id,
              item?._id,
              props?.userInfoState?.accessToken,
              1,
              0,
            ),
              swipeableRef?.current?.close();
          }}>
          <Text
            style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 14,
              textAlign: 'center',
            }}>
            Mark as{'\n'}Unread
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};
export const RightSwipeAction = React.memo(RightSwipeActionComponent);

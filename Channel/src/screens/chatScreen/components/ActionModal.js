import {View, Text, Dimensions} from 'react-native';
import React from 'react';
import {Modal} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../Styles';
import ActionList from './ActionList';
import {ActionMessageCardMemo} from './ActionMessageCard';

const ActionModal = ({
  setShowActions,
  chat,
  userInfoState,
  orgState,
  deleteMessageAction,
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails,
  searchUserProfileAction,
  flatListRef,
  channelType,
  setCurrentSelectedChatCard,
  currentSelectChatCard,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const {height} = Dimensions.get('window');

  return (
    <Modal
      animationType="fade"
      transparent={true}
      onRequestClose={() => setShowActions(false)}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => setShowActions(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
          }}>
          <TouchableWithoutFeedback onPress={() => setShowActions(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                maxHeight: height - 300,
              }}>
              <ActionMessageCardMemo
                chat={chat}
                userInfoState={userInfoState}
                orgState={orgState}
                deleteMessageAction={deleteMessageAction}
                chatState={chatState}
                setreplyOnMessage={setreplyOnMessage}
                setrepliedMsgDetails={setrepliedMsgDetails}
                searchUserProfileAction={searchUserProfileAction}
                flatListRef={flatListRef}
                channelType={channelType}
                setShowActions={setShowActions}
                setCurrentSelectedChatCard={setCurrentSelectedChatCard}
              />
              <ActionList
                sentByMe={
                  currentSelectChatCard?.senderId == userInfoState?.user?.id
                    ? true
                    : false
                }
                chat={currentSelectChatCard}
                setreplyOnMessage={setreplyOnMessage}
                setrepliedMsgDetails={setrepliedMsgDetails}
                setShowActions={setShowActions}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ActionModal;

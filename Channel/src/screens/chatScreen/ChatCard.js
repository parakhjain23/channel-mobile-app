import React, {useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddRemoveJoinedMsg = ({senderName, content, orgState}) => {
  const id = content.match(/\{\{(.*?)\}\}/);
  const extractedId = id ? id[1] : null;
  const splitInput = content.split('}}');
  const name =
    orgState?.userIdAndNameMapping[extractedId] + ' ' + splitInput[1];
  const activityName = content.split(' ')[0];
  const newContent =
    content == 'joined this channel'
      ? senderName + ' ' + content
      : senderName + ' ' + activityName + ' ' + name;
  return (
    <View style={[styles.actionText]}>
      <Text style={styles.text}>{newContent}</Text>
    </View>
  );
};
const ChatCard = ({
  chat,
  userInfoState,
  orgState,
  deleteMessageAction,
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails,
  // image = 'https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg',
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const swipeableRef = useRef(null);
  const onLongPress = () => {
    setOptionsVisible(true);
  };
  var parentId = chat?.parentId;
  const date = new Date(chat?.updatedAt);
  const time = date.getHours() + ':' + date.getMinutes();
  const sentByMe = chat?.senderId == userInfoState?.user?.id;
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndNameMapping[chat?.senderId];
  const swipeFromLeftOpen = () => {
    setrepliedMsgDetails(chat);
    setreplyOnMessage(true);
    swipeableRef?.current?.close();
  };
  const LeftSwipeActions = () => {
    return (
      <View style={{width: '10%', justifyContent: 'center', zIndex: 0}}>
        <Icon name="reply" size={20} />
      </View>
    );
  };
  return (
    <>
      {!chat?.isActivity ? (
        <GestureHandlerRootView>
          <TouchableOpacity onLongPress={sentByMe ? onLongPress : null}>
            <Swipeable
              ref={swipeableRef}
              renderLeftActions={LeftSwipeActions}
              onSwipeableLeftOpen={swipeFromLeftOpen}>
              <View
                style={[
                  styles.container,
                  sentByMe ? styles.sentByMe : styles.received,
                ]}>
                {/* {sentByMe ? null : (
                    <Image source={{uri: image}} style={styles.avatar} />
                  )} */}
                <View style={styles.textContainer}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.nameText, styles.text]}>
                      {SenderName}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        styles.text,
                        {marginHorizontal: 10},
                      ]}>
                      {time}
                    </Text>
                  </View>
                  {parentId != null && (
                    <View style={styles.repliedContainer}>
                      <Text style={styles.text}>
                        {
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content
                        }
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, styles.text]}>
                    {chat?.content}
                  </Text>
                </View>
                {/* <Text style={[styles.timeText, styles.text]}>{time}</Text> */}
                {/* {sentByMe ? (
                    <Image source={{uri: image}} style={styles.avatar} />
                  ) : null} */}
              </View>
              <View style={sentByMe ? styles.sentByMe : styles.received}>
                {optionsVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      setOptionsVisible(false),
                        deleteMessageAction(
                          userInfoState?.accessToken,
                          chat?._id,
                        );
                    }}>
                    <Text style={styles.text}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Swipeable>
          </TouchableOpacity>
        </GestureHandlerRootView>
      ) : (
        <AddRemoveJoinedMsg
          senderName={SenderName}
          content={chat?.content}
          orgState={orgState}
        />
      )}
    </>
  );
};
const LocalChatCard = ({
  chat,
  userInfoState,
  orgState,
  deleteMessageAction,
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails,
  // image = 'https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg',
}) => {
  console.log('in localCard');
  const [optionsVisible, setOptionsVisible] = useState(false);
  const swipeableRef = useRef(null);
  const onLongPress = () => {
    setOptionsVisible(true);
  };
  const parentId = chat?.parentId;
  const date = new Date(chat?.updatedAt);
  const time = date.getHours() + ':' + date.getMinutes();
  const sentByMe = chat?.senderId == userInfoState?.user?.id;
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndNameMapping[chat?.senderId];
  const swipeFromLeftOpen = () => {
    setrepliedMsgDetails(chat);
    setreplyOnMessage(true);
    swipeableRef?.current?.close();
  };
  const LeftSwipeActions = () => {
    return (
      <View style={{width: '10%', justifyContent: 'center', zIndex: 0}}>
        <Icon name="reply" size={20} />
      </View>
    );
  };
  return (
    <>
      {!chat?.isActivity ? (
        <GestureHandlerRootView>
          <TouchableOpacity onLongPress={sentByMe ? onLongPress : null}>
            <Swipeable
              ref={swipeableRef}
              renderLeftActions={LeftSwipeActions}
              onSwipeableLeftOpen={swipeFromLeftOpen}>
              <View
                style={[
                  styles.container,
                  sentByMe ? styles.sentByMe : styles.received,
                ]}>
                {/* {sentByMe ? null : (
                    <Image source={{uri: image}} style={styles.avatar} />
                  )} */}
                <View style={styles.textContainer}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.nameText, styles.text]}>
                      {SenderName}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        styles.text,
                        {marginHorizontal: 10},
                      ]}>
                      {time}
                    </Text>
                  </View>
                  {parentId != null && (
                    <View style={styles.repliedContainer}>
                      <Text style={styles.text}>
                        {
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content
                        }
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, styles.text]}>
                    {chat?.content}
                  </Text>
                  <Icon name="access-time" />
                </View>
                {/* <Text style={[styles.timeText, styles.text]}>{time}</Text> */}
                {/* {sentByMe ? (
                    <Image source={{uri: image}} style={styles.avatar} />
                  ) : null} */}
              </View>
              <View style={sentByMe ? styles.sentByMe : styles.received}>
                {optionsVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      setOptionsVisible(false),
                        deleteMessageAction(
                          userInfoState?.accessToken,
                          chat?._id,
                        );
                    }}>
                    <Text style={styles.text}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Swipeable>
          </TouchableOpacity>
        </GestureHandlerRootView>
      ) : (
        <AddRemoveJoinedMsg
          senderName={SenderName}
          content={chat?.content}
          orgState={orgState}
        />
      )}
    </>
  );
};
// export default React.memo(ChatCard)
export const ChatCardMemo = React.memo(ChatCard);
export const LocalChatCardMemo = React.memo(LocalChatCard);
// export default{React.memo(ChatCard), React.memo(LocalChatCard)};
const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  inputWithReply: {
    padding: 10,
  },
  inputWithoutReply: {
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: 'grey',
  },
  inputWithReplyContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
  },
  replyMessageInInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 5,
    borderWidth: 0.25,
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#d9d9d9',
  },
  repliedContainer: {
    padding: 5,
    backgroundColor: '#d9d9d9',
    borderRadius: 5,
    marginBottom: 4,
  },
  option: {
    margin: 8,
    backgroundColor: 'yellow',
  },
  actionText: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  container: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 15,
    maxWidth: '90%',
  },
  sentByMe: {
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  received: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  textContainer: {
    padding: 8,
    borderRadius: 8,
    flexDirection: 'column',
    maxWidth: '70%',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 14,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    marginRight: 3,
    marginBottom: 4,
  },
});

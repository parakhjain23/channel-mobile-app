import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import * as RootNavigation from '../../navigation/RootNavigation';
import RenderHTML from 'react-native-render-html';
import base64 from 'react-native-base64';
import { renderTextWithLinks } from './RenderTextWithLinks';

const AddRemoveJoinedMsg = ({senderName, content, orgState}) => {
  const regex = /\{\{(\w+)\}\}/g;
  const result = content.replace(regex, (match, userId) => {
    return orgState?.userIdAndNameMapping[userId] || match; // return the name if it exists, or the original match if not
  });
  return (
    <View style={[styles.actionText]}>
      <Text style={styles.text}>
        {senderName} {result}
      </Text>
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
  searchUserProfileAction,
  flatListRef
  // image = 'https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg',
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const {width} = useWindowDimensions()
  useEffect(() => {
    setOptionsVisible(false);
  }, [chatState?.data[chat?.teamId]?.messages]);
  const swipeableRef = useRef(null);
  const onLongPress = () => {
    setOptionsVisible(!optionsVisible);
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
  const isActivity =
    typeof chat.isActivity === 'string'
      ? chat.isActivity === 'true'
      : chat.isActivity;
  return (
    <>
      {!isActivity ? (
        <GestureHandlerRootView style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onLongPress={sentByMe ? onLongPress : null}
            style={{flex: 1}}>
            <Swipeable
              ref={swipeableRef}
              renderLeftActions={LeftSwipeActions}
              onSwipeableWillOpen={swipeFromLeftOpen}>
              <View
                style={[
                  styles.container,
                  sentByMe ? styles.sentByMe : styles.received,
                ]}>
                {optionsVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      setOptionsVisible(false),
                        deleteMessageAction(
                          userInfoState?.accessToken,
                          chat?._id,
                        );
                    }}
                    style={{
                      alignItems: 'center',
                      alignSelf: 'center',
                      paddingHorizontal: 20,
                    }}>
                    <Icon name="delete" color={'tomato'} />
                    <Text style={[styles.text, {color: 'tomato'}]}>Delete</Text>
                  </TouchableOpacity>
                )}
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
                    <TouchableOpacity style={styles.repliedContainer} onPress={()=>handleRepliedMessagePress(chatState?.data[chat.teamId]?.parentMessages[parentId],chatState,chat,flatListRef)}>
                      {renderTextWithLinks(
                        chatState?.data[chat.teamId]?.parentMessages[parentId]
                          ?.content,
                        chatState?.data[chat.teamId]?.parentMessages[parentId]
                          ?.mentions,
                        userInfoState?.accessToken,
                        orgState,width
                      )}
                    </TouchableOpacity>
                  )}
                  {chat?.attachment?.length > 0 &&
                    chat?.attachment?.map((item, index) => {
                      return item?.contentType?.includes('image') ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(item?.resourceUrl)}>
                          <Image
                            source={{uri: item?.resourceUrl}}
                            style={{height: 150, width: 150}}
                          />
                        </TouchableOpacity>
                      ) : (
                        <View
                          style={{
                            borderWidth: 0.5,
                            borderColor: 'gray',
                            borderRadius: 5,
                            padding: 10,
                          }}>
                          <TouchableOpacity
                            onPress={() => Linking.openURL(item?.resourceUrl)}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                              }}>
                              {item?.contentType?.includes('pdf') && (
                                <Image
                                  source={require('../../assests/images/attachments/pdfLogo.png')}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    marginRight: 5,
                                  }}
                                />
                              )}
                              {item?.contentType?.includes('doc') && (
                                <Image
                                  source={require('../../assests/images/attachments/docLogo.png')}
                                  style={{
                                    width: 40,
                                    height: 40,
                                    marginRight: 5,
                                  }}
                                />
                              )}

                              <View>
                                <Text style={{color: 'black'}}>
                                  {item?.title?.slice(0, 10) + '...'}
                                </Text>
                                <Text style={{color: 'black'}}>
                                  {'...' + item?.contentType?.slice(-10)}
                                </Text>
                              </View>
                              <Icon
                                name="save"
                                size={20}
                                style={{margin: 2}}
                                color="black"
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                  <Text style={[styles.messageText, styles.text]}>
                    {/* {chat?.content} */}
                    {renderTextWithLinks(chat?.content, chat?.mentions,userInfoState?.accessToken,orgState,width)}
                  </Text>
                </View>
                {/* <Text style={[styles.timeText, styles.text]}>{time}</Text> */}
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
                    <Text style={{color: 'black'}}>
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
                <Icon name="access-time" color={'black'} />
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
    marginLeft: 0,
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
const handleRepliedMessagePress = (repliedMessage,chatState,chat,flatListRef) => {
  if (repliedMessage) {
    const index = chatState?.data[chat.teamId]?.messages.findIndex(
      (item) => item._id === repliedMessage._id
    );
    if (index !== -1) {
      flatListRef?.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
        viewOffset: 0,
      });
    }
  }
};

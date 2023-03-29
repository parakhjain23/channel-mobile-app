import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import cheerio, {text} from 'cheerio';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import {renderTextWithLinks} from './RenderTextWithLinks';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from './ChatCardStyles';
import {ms} from 'react-native-size-matters';
import * as RootNavigation from '../../navigation/RootNavigation';
import InAppBrowser from 'react-native-inappbrowser-reborn';
const AddRemoveJoinedMsg = ({senderName, content, orgState}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
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
  flatListRef,
  channelType,
  // image = 'https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg',
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const swipeableRef = useRef(null);
  const attachment =
    typeof chat?.attachment == 'string'
      ? JSON.parse(chat?.attachment)
      : chat?.attachment;
  const handleImagePress = index => {
    setSelectedImage(chat?.attachment?.[index]);
  };

  const handleModalClose = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    setOptionsVisible(false);
  }, [chatState?.data[chat?.teamId]?.messages]);
  const onLongPress = () => {
    setOptionsVisible(!optionsVisible);
  };
  var parentId = chat?.parentId;
  const date = new Date(chat?.updatedAt);
  const time = date.getHours() + ':' + date.getMinutes();
  const sentByMe = chat?.senderId == userInfoState?.user?.id ? true : false;
  const containerBackgroundColor = sentByMe
    ? colors.sentByMeCardColor
    : colors.receivedCardColor;
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndDisplayNameMapping[chat?.senderId]
      ? orgState?.userIdAndDisplayNameMapping[chat?.senderId]
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
  const openLink = async url => {
    if (await InAppBrowser.isAvailable()) {
      const result = InAppBrowser?.open(url);
    } else {
      Linking.openURL(url);
    }
  };
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
                  {backgroundColor: containerBackgroundColor},
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
                <View style={[styles.textContainer, {maxWidth: '90%'}]}>
                  {channelType != 'DIRECT_MESSAGE' && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.nameText, styles.text]}>
                        {SenderName}
                      </Text>
                    </View>
                  )}
                  {/* <Text
                    style={[
                      styles.timeText,
                      styles.text,
                      {marginHorizontal: ms(10)},
                    ]}>
                    {time}
                  </Text> */}
                  {parentId != null && (
                    <TouchableOpacity
                      style={[styles.repliedContainer]}
                      onPress={() =>
                        handleRepliedMessagePress(
                          chatState?.data[chat.teamId]?.parentMessages[
                            parentId
                          ],
                          chatState,
                          chat,
                          flatListRef,
                        )
                      }>
                      {chatState?.data[chat.teamId]?.parentMessages[parentId]
                        ?.attachment?.length > 0 ? (
                        <Text style={{color: 'black'}}>
                          <Icon name="attach-file" size={14} /> attachment
                        </Text>
                      ) : (
                        renderTextWithLinks(
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content,
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.mentions,
                          true,
                          orgState,
                          searchUserProfileAction,
                          userInfoState,
                        )
                      )}
                    </TouchableOpacity>
                  )}
                  <View style={{maxWidth: '80%'}}>
                    <Modal
                      visible={selectedImage !== null}
                      transparent={true}
                      onRequestClose={handleModalClose}>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: 'rgba(0, 0, 0, 0.9)',
                        }}
                        activeOpacity={1}
                        onPress={handleModalClose}>
                        <Image
                          source={{uri: selectedImage?.resourceUrl}}
                          style={{
                            width: Dimensions.get('window').width,
                            height: Dimensions.get('window').height - 50,
                          }}
                          resizeMode="contain"
                        />
                      </TouchableOpacity>
                    </Modal>
                  </View>
                  {attachment?.length > 0 &&
                    attachment?.map((item, index) => {
                      return item?.contentType?.includes('image') ? (
                        <TouchableOpacity
                          key={index}
                          onPress={() => handleImagePress(index)}
                          // onPress={() => Linking.openURL(item?.resourceUrl)}
                          style={{marginVertical: 5, alignItems: 'center'}}>
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
                            marginVertical: 5,
                          }}
                          key={index}>
                          <TouchableOpacity
                            onPress={() => {
                              openLink(item?.resourceUrl);
                            }}>
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
                                <Text style={styles.text}>
                                  {item?.title?.slice(0, 10) + '...'}
                                </Text>
                                <Text style={styles.text}>
                                  {'...' + item?.contentType?.slice(-10)}
                                </Text>
                              </View>
                              <Icon
                                name="save"
                                size={20}
                                style={{margin: 2}}
                                color={colors.color}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end'}}>
                    <Text style={[styles.messageText, styles.text,{maxWidth:'90%'}]}>
                      {/* {chat?.content} */}
                      {renderTextWithLinks(
                        chat?.content,
                        chat?.mentions,
                        false,
                        orgState,
                        searchUserProfileAction,
                        userInfoState,
                      )}
                    </Text>
                    <Text
                      style={[
                        styles.timeText,
                        styles.text,
                        {marginHorizontal: ms(10)},
                      ]}>
                      {time}
                    </Text>
                  </View>
                </View>
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
  channelType,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);
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
              <View style={styles.textContainer}>
                {channelType != 'DIRECT_MESSAGE' && (
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
                )}
                {parentId != null && (
                  <View style={styles.repliedContainer}>
                    <Text style={{color: colors.textColor}}>
                      {
                        chatState?.data[chat.teamId]?.parentMessages[parentId]
                          ?.content
                      }
                    </Text>
                  </View>
                )}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.messageText, styles.text]}>
                    {renderTextWithLinks(
                      chat?.content,
                      chat?.mentions,
                      false,
                      orgState,
                      userInfoState,
                    )}
                  </Text>
                  <View style={{alignSelf: 'flex-end'}}>
                    <Icon name="access-time" color={colors.textColor} />
                  </View>
                </View>
              </View>
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

const handleRepliedMessagePress = (
  repliedMessage,
  chatState,
  chat,
  flatListRef,
) => {
  if (repliedMessage) {
    const index = chatState?.data[chat.teamId]?.messages.findIndex(
      item => item._id === repliedMessage._id,
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

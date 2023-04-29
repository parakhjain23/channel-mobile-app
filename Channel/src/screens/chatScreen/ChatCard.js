import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import {RenderTextWithLinks, renderTextWithLinks} from './RenderTextWithLinks';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from './ChatCardStyles';
import {ms} from 'react-native-size-matters';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import ImageViewer from 'react-native-image-zoom-viewer';
const AddRemoveJoinedMsg = React.memo(({senderName, content, orgState}) => {
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
});
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
  index
}) => {
  const {colors, dark} = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const swipeableRef = useRef(null);
  const sameSender= typeof chat?.sameSender === 'string' ? JSON.parse(chat?.sameSender) : chat?.sameSender
  const isSameDate = typeof chat?.isSameDate === 'string' ? JSON.parse(chat?.isSameDate) : chat?.isSameDate
  // const timeToShow = typeof chat?.timeToShow === 'string' ? JSON.parse(chat?.timeToShow) : chat?.timeToShow
  const attachment = useMemo(() => {
    if (typeof chat?.attachment === 'string') {
      return JSON.parse(chat?.attachment);
    } else {
      return chat?.attachment;
    }
  }, [chat?.attachment]);

  const handleImagePress = useCallback(
    index => {
      setSelectedImage(chat?.attachment?.[index]);
    },
    [chat?.attachment],
  );

  const handleModalClose = useCallback(() => {
    setSelectedImage(null);
  }, []);

  useEffect(() => {
    setOptionsVisible(false);
  }, [chatState?.data[chat?.teamId]?.messages]);
  const onLongPress = () => {
    setOptionsVisible(!optionsVisible);
  };
  var parentId = chat?.parentId;
  const date = useMemo(() => new Date(chat?.updatedAt), [chat?.updatedAt]);
  const time = useMemo(() => date.getHours() + ':' + date.getMinutes(), [date]);
  const sentByMe = chat?.senderId == userInfoState?.user?.id ? true : false;
  const containerBackgroundColor = useMemo(() => {
    if (sentByMe) {
      return colors.sentByMeCardColor;
    } else {
      return colors.receivedCardColor;
    }
  }, [colors, sentByMe]);
  const SenderName = useMemo(() => {
    if (chat?.senderId === userInfoState?.user?.id) {
      return 'You';
    } else if (orgState?.userIdAndDisplayNameMapping[chat?.senderId]) {
      return orgState?.userIdAndDisplayNameMapping[chat?.senderId];
    } else {
      return orgState?.userIdAndNameMapping[chat?.senderId];
    }
  }, [chat?.senderId, orgState, userInfoState]);
  const swipeFromLeftOpen = () => {
    setrepliedMsgDetails(chat);
    setreplyOnMessage(true);
    swipeableRef?.current?.close();
  };
  const LeftSwipeActions = () => {
    return (
      <View style={{width: '10%', justifyContent: 'center', zIndex: 0}}>
        <Icon name="reply" size={20} color={colors?.color} />
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
  if (!isActivity) {
    return (
      <GestureHandlerRootView style={{}}>
       <TouchableOpacity
          activeOpacity={0.6}
          onLongPress={sentByMe ? onLongPress : null}
          style={{flex: 1}}>
          <Swipeable
            ref={swipeableRef}
            renderLeftActions={LeftSwipeActions}
            onSwipeableWillOpen={swipeFromLeftOpen}
            >
            <View
              style={[
                styles.container,
                sentByMe ? styles.sentByMe : styles.received,
                {backgroundColor: containerBackgroundColor,marginTop: sameSender ? ms(0) : ms(10),marginBottom:4},
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
                    paddingHorizontal: ms(20),
                  }}>
                  <Icon name="delete" color={'tomato'} />
                  <Text style={[styles.text, {color: 'tomato'}]}>Delete</Text>
                </TouchableOpacity>
              )}
              <View style={[styles.textContainer, {maxWidth: '90%'}]}>
                {channelType != 'DIRECT_MESSAGE' && SenderName != 'You' && !sameSender && (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={[styles.nameText, styles.text]}>
                      {SenderName}
                    </Text>
                  </View>
                )}
                {parentId != null && (
                  <TouchableOpacity
                    style={[styles.repliedContainer]}
                    onPress={() =>
                      handleRepliedMessagePress(
                        chatState?.data[chat.teamId]?.parentMessages[parentId],
                        chatState,
                        chat,
                        flatListRef,
                      )
                    }>
                    {chatState?.data[chat.teamId]?.parentMessages[parentId]
                      ?.attachment?.length > 0 ? (
                      <Text style={{color: 'black'}}>
                        <Icon name="attach-file" size={ms(14)} /> attachment
                      </Text>
                    ) : (
                      <RenderTextWithLinks
                        text={
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content
                        }
                        mentions={
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.mentions
                        }
                        repliedContainer={true}
                        orgState={orgState}
                        searchUserProfileAction={searchUserProfileAction}
                        userInfoState={userInfoState}
                        colors={colors}
                      />
                    )}
                  </TouchableOpacity>
                )}
                <View style={{maxWidth: '80%'}}>
                  <Modal
                    visible={selectedImage !== null}
                    transparent={true}
                    onRequestClose={handleModalClose}>
                    <ImageViewer
                      imageUrls={[
                        {
                          url: selectedImage?.resourceUrl,
                          // width: Dimensions.get('window')?.width - 20,
                          // height: Dimensions.get('window')?.height,
                          freeHeight: true,
                          freeWidth: true,
                        },
                      ]}
                      enableSwipeDown={true}
                      onSwipeDown={handleModalClose}
                    />
                  </Modal>
                </View>
                {attachment?.length > 0 &&
                  attachment?.map((item, index) => {
                    return item?.contentType?.includes('image') ? (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleImagePress(index)}
                        style={{marginVertical: ms(5), alignItems: 'center'}}>
                        <Image
                          source={{uri: item?.resourceUrl}}
                          style={{height: ms(150), width: ms(150)}}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={[
                          styles.repliedContainer,
                          {
                            borderWidth: ms(0.5),
                            borderColor: 'gray',
                            borderRadius: ms(5),
                            padding: ms(10),
                          },
                        ]}
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
                                  width: ms(40),
                                  height: ms(40),
                                  marginRight: ms(5),
                                }}
                              />
                            )}
                            {item?.contentType?.includes('doc') && (
                              <Image
                                source={require('../../assests/images/attachments/docLogo.png')}
                                style={{
                                  width: ms(40),
                                  height: ms(40),
                                  marginRight: ms(5),
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
                              size={ms(20)}
                              style={{margin: ms(2)}}
                              color={'black'}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    );
                  })}

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                  }}>
                  <Text
                    style={[
                      styles.messageText,
                      // styles.text,
                      {maxWidth: '90%', color: 'white'},
                    ]}>
                    <RenderTextWithLinks
                      text={chat?.content}
                      mentions={chat?.mentions}
                      repliedContainer={false}
                      orgState={orgState}
                      searchUserProfileAction={searchUserProfileAction}
                      userInfoState={userInfoState}
                      colors={colors}
                      sentByMe={sentByMe}
                    />
                  </Text>
                  {chat?.randomId != null ? (
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        width: 30,
                      }}>
                      <Icon name="access-time" color={'white'} />
                    </View>
                  ) : (
                    <Text
                      style={[
                        styles.timeText,
                        styles.text,
                        {
                          marginHorizontal: ms(10),
                          color: sentByMe ? '#cccccc' : dark ? '#cccccc' : 'black',
                        },
                      ]}>
                      {time}
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </Swipeable>
        </TouchableOpacity>
        {!isSameDate &&(
            <View>
              <Text
                style={{
                  color: '#808080',
                  textAlign: 'center',
                  marginBottom: ms(10),
                  marginTop: ms(7)
                }}>
                {chat?.timeToShow}
              </Text>
            </View>
          )}
      </GestureHandlerRootView>
    );
  } else {
    return (
      <AddRemoveJoinedMsg
        senderName={SenderName}
        content={chat?.content}
        orgState={orgState}
      />
    );
  }
};
export const ChatCardMemo = React.memo(ChatCard);

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

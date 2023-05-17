import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Image,
  Modal,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  useWindowDimensions,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Linking} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from './ChatCardStyles';
import {ms, s} from 'react-native-size-matters';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import ImageViewer from 'react-native-image-zoom-viewer';
import Clipboard from '@react-native-community/clipboard';
import HTMLView from 'react-native-htmlview';
import {RenderHTML} from 'react-native-render-html';
import * as RootNavigation from '../../navigation/RootNavigation';
import {tagsStyles} from './HtmlStyles';
import WebView from 'react-native-webview';
import AudioRecordingPlayer from '../../components/AudioRecorderPlayer';


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
  index,
}) => {
  const {colors, dark} = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const swipeableRef = useRef(null);
  const {width} = useWindowDimensions();
  const sameSender =
    typeof chat?.sameSender === 'string'
      ? chat.sameSender === 'true'
      : chat?.sameSender;
  const isSameDate =
    typeof chat?.isSameDate === 'string'
      ? chat.isSameDate === 'true'
      : chat?.isSameDate;
  const isActivity =
    typeof chat.isActivity === 'string'
      ? chat.isActivity === 'true'
      : chat.isActivity;
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
    !optionsVisible &&
      handleRepliedMessagePress(false, chatState, chat, flatListRef);
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
  const linkColor = sentByMe
    ? colors.sentByMeLinkColor
    : colors.recivedLinkColor;

  const textColor = sentByMe ? colors.sentByMeTextColor : colors?.textColor;

  const swipeFromLeftOpen = () => {
    Vibration.vibrate(30);
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

  const copyToClipboard = text => {
    Clipboard.setString(text);
  };

  const openLink = async url => {
    if (await InAppBrowser.isAvailable()) {
      const result = InAppBrowser?.open(url);
    } else {
      Linking.openURL(url);
    }
  };

  const OptionsList = ({sentByMe}) => {
    return (
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: ms(5),
          elevation: 5, // add elevation for Android
          shadowColor: colors?.secondarColor, // add shadow properties for iOS
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          paddingVertical: ms(8),
          paddingHorizontal: ms(16),
          marginHorizontal: ms(8),
          marginTop: ms(5),
          marginBottom: ms(10),
        }}>
        <TouchableOpacity
          onPress={() => {
            setOptionsVisible(false), copyToClipboard(chat?.content);
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: ms(8),
          }}>
          <Icon name="content-copy" size={ms(20)} color={'black'} />
          <Text
            style={[
              styles.text,
              styles.optionsText,
              {paddingHorizontal: ms(10)},
            ]}>
            Copy
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setOptionsVisible(false), swipeFromLeftOpen();
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: ms(8),
          }}>
          <Icon name="reply" size={ms(20)} color={'black'} />
          <Text
            style={[
              styles.text,
              styles.optionsText,
              {paddingHorizontal: ms(10)},
            ]}>
            Reply
          </Text>
        </TouchableOpacity>
        {sentByMe && (
          <TouchableOpacity
            onPress={() => {
              setOptionsVisible(false),
                deleteMessageAction(userInfoState?.accessToken, chat?._id);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: ms(8),
            }}>
            <Icon name="delete" color={'tomato'} size={ms(20)} />
            <Text
              style={[
                styles.text,
                styles.optionsText,
                {color: 'tomato', paddingHorizontal: ms(10)},
              ]}>
              Delete
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const htmlStyles = {
    div: {
      color: textColor,
    },
  };
  function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.attribs?.class == 'mention') {
      return (
        <TouchableOpacity
          key={index}
          onPress={async () => {
            node?.attribs?.['data-id'] != '@all' &&
              (await searchUserProfileAction(
                node?.attribs?.['data-id'],
                userInfoState?.accessToken,
              )) &&
              RootNavigation.navigate('UserProfiles', {
                displayName:
                  orgState?.userIdAndDisplayNameMapping[
                    node?.attribs?.['data-id']
                  ],
              });
          }}>
          <Text style={{color: linkColor, textDecorationLine: 'underline'}}>
            @{node?.attribs?.['data-value']}
          </Text>
        </TouchableOpacity>
      );
    }
  }
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

  if (!isActivity) {
    return (
      <GestureHandlerRootView>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => (optionsVisible ? onLongPress() : null)}
          onLongPress={onLongPress}
          style={{flex: 1}}>
          <Swipeable
            ref={swipeableRef}
            leftThreshold={40}
            renderLeftActions={LeftSwipeActions}
            onSwipeableWillOpen={swipeFromLeftOpen}>
            <View
              style={[
                styles.container,
                sentByMe ? styles.sentByMe : styles.received,
                {
                  backgroundColor: containerBackgroundColor,
                  marginTop: sameSender ? ms(0) : ms(10),
                  marginBottom: index == 0 ? 10 : 3,
                },
              ]}>
              <View style={[styles.textContainer]}>
                {channelType != 'DIRECT_MESSAGE' &&
                  SenderName != 'You' &&
                  !sameSender && (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.nameText, styles.text]}>
                        {SenderName}
                      </Text>
                    </View>
                  )}
                {parentId != null && (
                  <TouchableOpacity
                    style={[styles.repliedContainer]}
                    onPress={() => {
                      !optionsVisible
                        ? handleRepliedMessagePress(
                            chatState?.data[chat.teamId]?.parentMessages[
                              parentId
                            ],
                            chatState,
                            chat,
                            flatListRef,
                          )
                        : onLongPress();
                    }}
                    onLongPress={onLongPress}>
                    {chatState?.data[chat.teamId]?.parentMessages[parentId]
                      ?.attachment?.length > 0 ? (
                      <Text style={{color: 'black'}}>
                        <Icon name="attach-file" size={ms(14)} /> attachment
                      </Text>
                    ) : chat?.mentions?.length > 0 ? (
                      <HTMLView
                        value={`<div>${
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content
                        }</div>`}
                        renderNode={renderNode}
                        stylesheet={htmlStyles}
                      />
                    ) : (
                      <RenderHTML
                        source={{
                          html: chatState?.data[chat.teamId]?.parentMessages[
                            parentId
                          ]?.content?.replace(
                            emailRegex,
                            '<a href="mailTo:$&">$&</a>',
                          ),
                        }}
                        contentWidth={width}
                        tagsStyles={{body: {color: 'black'}}}
                        // renderers={renderers}
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
                        onPress={() =>
                          optionsVisible
                            ? onLongPress()
                            : handleImagePress(index)
                        }
                        onLongPress={onLongPress}
                        style={{marginVertical: ms(5), alignItems: 'center'}}>
                        <Image
                          source={{uri: item?.resourceUrl}}
                          style={{
                            height: ms(150),
                            width: ms(150),
                            opacity: optionsVisible ? 0.6 : 1,
                          }}
                        />
                      </TouchableOpacity>
                    ) : item?.contentType?.includes('audio/mpeg') ? (
                      <View
                        key={index}
                        style={{
                          flexDirection: 'row',
                          height: ms(50),
                          width: s(250),
                          flex: 1,
                          alignItems: 'center',
                          overflow: 'hidden',
                          justifyContent: 'center', // Align center horizontally
                        }}>
                        {/* <WebView
                          source={{
                            html: `
                                  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=3, user-scalable=yes">
                                  <style>
                                    body, html { margin: 0; padding: 0; flex: 1; display: flex; align-items: center;}
                                    audio { width: 100%;}
                                  </style>
                                  <audio controls>
                                    <source src="${item?.resourceUrl}" type="audio/mp4">
                                  </audio>
                                `,
                          }}
                          style={{flex: 1}}
                        /> */}
                        <AudioRecordingPlayer remoteUrl={item?.resourceUrl} />
                      </View>
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
                          onPress={() =>
                            !optionsVisible
                              ? openLink(item?.resourceUrl)
                              : onLongPress()
                          }
                          onLongPress={onLongPress}>
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
                  {/* <Text
                    style={[
                      // styles.messageText,
                      // styles.text,
                      {maxWidth: '90%', color: 'white'},
                    ]}> */}
                  <View
                    style={{
                      flexDirection: 'row',
                      maxWidth: '90%',
                      paddingRight: ms(10),
                    }}>
                    {chat?.mentions?.length > 0 ? (
                      <HTMLView
                        value={`<div>${chat?.content}</div>`}
                        renderNode={renderNode}
                        stylesheet={htmlStyles}
                      />
                    ) : (
                      <RenderHTML
                        source={{
                          html: chat?.content?.replace(
                            emailRegex,
                            '<a href="mailTo:$&">$&</a>',
                          ),
                        }}
                        contentWidth={width}
                        tagsStyles={tagsStyles(textColor, linkColor)}
                        // renderers={renderers}
                      />
                    )}
                  </View>
                  {/* </Text> */}
                  <View
                    style={{
                      justifyContent: 'flex-end',
                    }}>
                    {chat?.randomId != null ? (
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'flex-end',
                          width: ms(20),
                        }}>
                        <Icon name="access-time" color={'white'} />
                      </View>
                    ) : (
                      <Text
                        style={[
                          styles.timeText,
                          styles.text,
                          {
                            color: sentByMe
                              ? '#cccccc'
                              : dark
                              ? '#cccccc'
                              : 'black',
                          },
                        ]}>
                        {time}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </Swipeable>
        </TouchableOpacity>
        {!isSameDate && (
          <View>
            <Text
              style={{
                color: '#808080',
                textAlign: 'center',
                marginTop: ms(15),
                marginBottom: ms(3),
              }}>
              {chat?.timeToShow}
            </Text>
          </View>
        )}
        {optionsVisible && <OptionsList sentByMe={sentByMe} />}
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
        viewOffset: 50,
      });
    }
  } else {
    const index = chatState?.data[chat.teamId]?.messages.findIndex(
      item => item?._id === chat?._id,
    );
    if (index !== -1) {
      flatListRef?.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0,
        viewOffset: ms(50),
      });
    }
  }
};

import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import HTMLView from 'react-native-htmlview';
import {RenderHTML} from 'react-native-render-html';
import * as RootNavigation from '../../navigation/RootNavigation';
import {tagsStyles} from './HtmlStyles';
import AudioRecordingPlayer from '../../components/AudioRecorderPlayer';
import {AppContext} from '../appProvider/AppProvider';
import {DEVICE_TYPES} from '../../constants/Constants';
import {connect, useSelector} from 'react-redux';
import {setActiveChannelTeamId} from '../../redux/actions/channels/SetActiveChannelId';
import {formatTime} from '../../utils/FormatTime';
import FastImage from 'react-native-fast-image';

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
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails,
  searchUserProfileAction,
  flatListRef,
  channelType,
  index,
  setShowActions,
  setCurrentSelectedChatCard,
  setChatDetailsForTab,
  setActiveChannelTeamIdAction,
}) => {
  const deviceType = useSelector(state => state.appInfoReducer.deviceType);
  const {colors, dark} = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const swipeableRef = useRef(null);
  const {width} = useWindowDimensions();
  const [showMore, setShoreMore] = useState(false);

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
    setShowActions(false);
  }, [chatState?.data[chat?.teamId]?.messages]);

  const onLongPress = () => {
    setCurrentSelectedChatCard(chat);
    setShowActions(true);
    setOptionsVisible(!optionsVisible);
  };
  var parentId = chat?.parentId;
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

  const openLink = async url => {
    if (await InAppBrowser.isAvailable()) {
      const result = InAppBrowser?.open(url);
    } else {
      Linking.openURL(url);
    }
  };

  const htmlStyles = color => ({
    div: {
      color: color,
      fontSize: 16,
    },
  });

  const handleListItemPress = (
    teamId,
    channelType,
    userId,
    searchedChannel,
    Name,
  ) => {
    setChatDetailsForTab({
      teamId: teamId,
      channelType: channelType,
      userId: userId,
      searchedChannel: searchedChannel,
      channelName: Name,
    });
  };
  const onPress = (teamId, channelName) => {
    // networkState?.isInternetConnected && resetChatsAction();
    if (deviceType === DEVICE_TYPES[1]) {
      handleListItemPress(
        teamId,
        'PERSONAL',
        chat?.senderId,
        false,
        channelName,
      );
    } else {
      RootNavigation.navigate('Chat', {
        chatHeaderTitle: channelName,
        teamId: teamId,
        channelType: 'PERSONAL',
        userId: chat?.senderId,
        searchedChannel: false,
      });
    }
    setActiveChannelTeamIdAction(teamId);
  };
  function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.attribs?.class == 'mention') {
      return node?.attribs['data-username'] ? (
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
                setChatDetailsForTab: setChatDetailsForTab,
              });
          }}>
          <Text
            style={{
              color: chatState?.data[chat.teamId]?.parentMessages[parentId]
                ?.content
                ? 'black'
                : linkColor,
              textDecorationLine: 'underline',
              fontSize: 16,
            }}>
            @{node?.attribs?.['data-value']}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          key={index}
          onPress={() =>
            onPress(node?.attribs?.['data-id'], node?.attribs?.['data-value'])
          }>
          <Text
            style={{
              color: chatState?.data[chat.teamId]?.parentMessages[parentId]
                ?.content
                ? 'black'
                : linkColor,
              textDecorationLine: 'underline',
              fontSize: 16,
            }}>
            #{node?.attribs?.['data-value']}
          </Text>
        </TouchableOpacity>
      );
    }
  }
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

  if (!isActivity) {
    return (
      <GestureHandlerRootView>
        {channelType == 'DIRECT_MESSAGE' && !sameSender && (
          <View style={[sentByMe ? styles.sentByMe : styles?.received]}>
            <Text style={{fontSize: 12, color: colors?.color}}>
              {formatTime(chat?.createdAt)}
            </Text>
          </View>
        )}
        {(channelType == 'PUBLIC' ||
          channelType == 'PRIVATE' ||
          channelType == 'DEFAULT') &&
          !sameSender &&
          SenderName == 'You' && (
            <View style={[sentByMe ? styles.sentByMe : styles?.received]}>
              <Text style={{fontSize: 12, color: colors?.color}}>
                {formatTime(chat?.createdAt)}
              </Text>
            </View>
          )}
        <View
          style={{
            flexDirection: 'row',
            marginTop: sameSender
              ? ms(0)
              : channelType == 'DIRECT_MESSAGE'
              ? ms(0)
              : SenderName == 'You'
              ? ms(0)
              : ms(10),
            marginBottom: index == 0 ? 10 : 3,
          }}>
          {SenderName != 'You' && channelType != 'DIRECT_MESSAGE' && (
            <TouchableOpacity
              onPress={async () => {
                chat?.senderId != '0' &&
                  (await searchUserProfileAction(
                    chat?.senderId,
                    userInfoState?.accessToken,
                  )) &&
                  RootNavigation.navigate('UserProfiles', {
                    displayName:
                      orgState?.userIdAndDisplayNameMapping[chat?.senderId],
                    setChatDetailsForTab: setChatDetailsForTab,
                  });
              }}>
              <View
                style={{
                  justifyContent: 'flex-start',
                  marginRight: 5,
                  marginTop: 5,
                }}>
                {!sameSender ? (
                  <FastImage
                    source={{
                      uri: orgState?.userIdAndImageUrlMapping[chat?.senderId]
                        ? orgState?.userIdAndImageUrlMapping[chat?.senderId]
                        : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVe0cFaZ9e5Hm9X-tdWRLSvoZqg2bjemBABA&usqp=CAU',
                      priority: FastImage.priority.normal,
                    }}
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 50,
                    }}
                  />
                ) : (
                  <View style={{width: 35}}></View>
                )}
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.6}
            onLongPress={onLongPress}
            style={{flex: 1}}>
            <Swipeable
              ref={swipeableRef}
              leftThreshold={40}
              renderLeftActions={LeftSwipeActions}
              onSwipeableWillOpen={swipeFromLeftOpen}>
              <View
                style={[
                  sentByMe ? styles.sentByMe : styles.received,
                  {
                    flexDirection: 'row',
                    flex: 1,
                    flexWrap: 'wrap',
                  },
                ]}>
                <View style={{justifyContent: 'flex-end'}}>
                  {chat?.randomId != null && (
                    <View
                      style={{
                        width: 20,
                      }}>
                      <Icon name="access-time" color={colors.color} />
                    </View>
                  )}
                </View>
                <View
                  style={[
                    styles.container,
                    {
                      backgroundColor: containerBackgroundColor,
                    },
                  ]}>
                  <View style={[styles.textContainer]}>
                    {channelType != 'DIRECT_MESSAGE' &&
                      SenderName != 'You' &&
                      !sameSender && (
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}>
                          <Text
                            style={[
                              styles.nameText,
                              {marginRight: 5, color: textColor},
                            ]}>
                            {SenderName}
                          </Text>
                          <Text style={[styles.timeText, styles.text]}>
                            {formatTime(chat?.createdAt)}
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
                        ) : chatState?.data[chat.teamId]?.parentMessages[
                            parentId
                          ]?.content?.includes('<span class="mention"') ? (
                          <HTMLView
                            value={`<div>${
                              chatState?.data[chat.teamId]?.parentMessages[
                                parentId
                              ]?.content
                            }</div>`}
                            renderNode={renderNode}
                            stylesheet={htmlStyles('black')}
                          />
                        ) : (
                          <RenderHTML
                            source={{
                              html: chatState?.data[
                                chat.teamId
                              ]?.parentMessages[parentId]?.content?.replace(
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
                            style={{marginVertical: 5, alignItems: 'center'}}>
                            <FastImage
                              source={{uri: item?.resourceUrl}}
                              style={{
                                height: 150,
                                width: 150,
                              }}
                            />
                            {/* <Image
                              source={{uri: item?.resourceUrl}}
                              style={{
                                height: 150,
                                width: 150,
                              }}
                            /> */}
                          </TouchableOpacity>
                        ) : item?.contentType?.includes('audio') ? (
                          <View
                            key={index}
                            style={{
                              flexDirection: 'row',
                              height: 50,
                              width: ms(260),
                              flex: 1,
                              alignItems: 'center',
                              overflow: 'hidden',
                              justifyContent: 'center', // Align center horizontally
                            }}>
                            <AudioRecordingPlayer
                              remoteUrl={item?.resourceUrl}
                            />
                          </View>
                        ) : (
                          <View
                            key={index}
                            style={[
                              styles.repliedContainer,
                              {
                                borderWidth: ms(0.5),
                                borderColor: 'gray',
                                borderRadius: ms(5),
                                padding: ms(10),
                              },
                            ]}>
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
                                      width: 40,
                                      height: 40,
                                      marginRight: 15,
                                    }}
                                  />
                                )}
                                {item?.contentType?.includes('doc') && (
                                  <Image
                                    source={require('../../assests/images/attachments/docLogo.png')}
                                    style={{
                                      width: 40,
                                      height: 40,
                                      marginRight: 15,
                                    }}
                                  />
                                )}

                                <View>
                                  <Text style={{color: 'black'}}>
                                    {item?.title?.slice(0, 15) + '...'}
                                  </Text>
                                  <Text style={{color: 'black'}}>
                                    {'...' + item?.contentType?.slice(-15)}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          </View>
                        );
                      })}

                    {chat?.content?.includes('<span class="mention"') ? (
                      <HTMLView
                        value={`<div>${chat?.content}</div>`}
                        renderNode={renderNode}
                        stylesheet={htmlStyles(textColor)}
                      />
                    ) : (
                      <RenderHTML
                        source={{
                          html: !showMore
                            ? chat?.content
                                ?.slice(0, 400)
                                .replace(
                                  emailRegex,
                                  '<a href="mailTo:$&">$&</a>',
                                )
                            : chat?.content?.replace(
                                emailRegex,
                                '<a href="mailTo:$&">$&</a>',
                              ),
                        }}
                        contentWidth={width}
                        tagsStyles={tagsStyles(textColor, linkColor)}
                      />
                    )}
                    {chat?.content?.length > 500 &&
                      (showMore ? (
                        <Text
                          style={{
                            color: linkColor,
                            textDecorationLine: 'underline',
                            marginTop: 5,
                          }}
                          onPress={() => setShoreMore(!showMore)}>
                          Shore Less
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: linkColor,
                            textDecorationLine: 'underline',
                            marginTop: 5,
                          }}
                          onPress={() => setShoreMore(!showMore)}>
                          Show More
                        </Text>
                      ))}
                  </View>
                </View>
              </View>
            </Swipeable>
          </TouchableOpacity>
        </View>
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

const mapDispatchToProps = dispatch => {
  return {
    setActiveChannelTeamIdAction: teamId =>
      dispatch(setActiveChannelTeamId(teamId)),
  };
};
export const ChatCardMemo = React.memo(
  connect(null, mapDispatchToProps)(ChatCard),
);

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

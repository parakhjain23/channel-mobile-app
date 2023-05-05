import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import uuid from 'react-native-uuid';
import {
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import ListFooterComponent from '../../components/ListFooterComponent';
import {setActiveChannelTeamId} from '../../redux/actions/channels/SetActiveChannelId';
import {
  getChatsStart,
  sendMessageStart,
  setGlobalMessageToSend,
} from '../../redux/actions/chat/ChatActions';
import {deleteMessageStart} from '../../redux/actions/chat/DeleteChatAction';
import {ChatCardMemo} from './ChatCard';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import {pickDocument} from './DocumentPicker';
import {launchCameraForPhoto, launchGallery} from './ImagePicker';
import {makeStyles} from './Styles';
import {useTheme} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import {s, ms, mvs} from 'react-native-size-matters';
import {setLocalMsgStart} from '../../redux/actions/chat/LocalMessageActions';
import {resetUnreadCountStart} from '../../redux/actions/channels/ChannelsAction';
import HTMLView from 'react-native-htmlview';
import RenderHTML from 'react-native-render-html';
import {tagsStyles} from './HtmlStyles';

const ChatScreen = ({
  route,
  userInfoState,
  networkState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction,
  channelsState,
  setActiveChannelTeamIdAction,
  setGlobalMessageToSendAction,
  getChannelsByQueryStartAction,
  channelsByQueryState,
  searchUserProfileAction,
  setlocalMsgAction,
  resetUnreadCountAction,
}) => {
  var {teamId, reciverUserId, channelType, searchedChannel} = route.params;
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [message, onChangeMessage] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [mentionsArr, setMentionsArr] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mentions, setMentions] = useState([]);
  const FlatListRef = useRef(null);
  const textInputRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const offset = height * 0.12;
  const {height} = Dimensions.get('window');
  const screenHeight = Dimensions.get('window').height;
  const {width} = useWindowDimensions();
  const date = useMemo(() => new Date(), []);

  const teamIdAndUnreadCountMapping =
    channelsState?.teamIdAndUnreadCountMapping;
  const teamIdAndBadgeCountMapping = channelsState?.teamIdAndBadgeCountMapping;
  const user = userInfoState?.user;
  const accessToken = userInfoState?.accessToken;
  const currentOrgId = orgState?.currentOrgId;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  const shouldResetUnreadCount =
    teamIdAndUnreadCountMapping?.[teamId] > 0 ||
    teamIdAndBadgeCountMapping?.[teamId] > 0;

  useEffect(() => {
    if (repliedMsgDetails != '') {
      textInputRef.current.focus();
    }
  }, [repliedMsgDetails]);
  const skip =
    chatState?.data[teamId]?.messages?.length != undefined
      ? chatState?.data[teamId]?.messages?.length
      : 0;
  useEffect(() => {
    searchedChannel && textInputRef?.current?.focus();
    setTimeout(() => {
      if (shouldResetUnreadCount) {
        resetUnreadCountAction(
          currentOrgId,
          user?.id,
          teamId,
          accessToken,
          0,
          0,
        );
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (
      chatState?.data[teamId]?.messages == undefined ||
      chatState?.data[teamId]?.messages == [] ||
      (!chatState?.data[teamId]?.apiCalled && networkState?.isInternetConnected)
    ) {
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
    setActiveChannelTeamIdAction(teamId);
  }, [networkState?.isInternetConnected, teamId]);

  const optionsPosition = useRef(new Animated.Value(0)).current;

  const showOptionsMethod = () => {
    setShowOptions(true);
    Animated.timing(optionsPosition, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const hideOptionsMethod = () => {
    Animated.timing(optionsPosition, {
      toValue: -200,
      duration: 250,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setShowOptions(false);
    }, 130);
  };
  const handleInputChange = useCallback(
    text => {
      console.log(text, '=-=--=-=-=-=-=-=-');
      onChangeMessage(text);
      const mentionRegex = /@\w+/g;
      const foundMentions = text?.match(mentionRegex);
      foundMentions?.length > 0
        ? (getChannelsByQueryStartAction(
            foundMentions?.[foundMentions?.length - 1].replace('@', ''),
            userInfoState?.user?.id,
            orgState?.currentOrgId,
          ),
          setMentions(channelsByQueryState?.mentionChannels))
        : setMentions([]);
    },
    [
      onChangeMessage,
      channelsByQueryState?.mentionChannels,
      userInfoState?.user?.id,
      orgState?.currentOrgId,
    ],
  );

  const handleMentionSelect = mention => {
    mention?._source?.userId != undefined
      ? setMentionsArr(prevUserIds => [
          ...prevUserIds,
          mention?._source?.userId,
        ])
      : setMentionsArr(prevUserIds => [...prevUserIds, '@all']),
      onChangeMessage(prevmessage =>
        prevmessage.replace(
          new RegExp(`@\\w+\\s?$`),
          `@${mention?._source?.displayName} `,
        ),
      );
    setMentions([]);
  };

  const renderMention = useMemo(
    () =>
      ({item, index}) =>
        item?._source?.type == 'U' && (
          <TouchableOpacity
            onPress={() => handleMentionSelect(item)}
            key={index}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: ms(0.7),
                borderTopColor: 'grey',
                margin: s(2),
                padding: s(2),
              }}>
              <MaterialIcons
                name="account-circle"
                size={20}
                color={colors.textColor}
              />
              <Text style={{fontSize: 16, margin: 4, color: colors.textColor}}>
                {item?._source?.displayName}
              </Text>
            </View>
          </TouchableOpacity>
        ),
    [handleMentionSelect],
  );

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolling(offsetY >= 0.7 * screenHeight);
      },
    },
  );
  const memoizedData = useMemo(
    () => chatState?.data[teamId]?.messages || [],
    [chatState?.data[teamId]?.messages],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ChatCardMemo
          chat={item}
          userInfoState={userInfoState}
          orgState={orgState}
          deleteMessageAction={deleteMessageAction}
          chatState={chatState}
          setreplyOnMessage={setreplyOnMessage}
          setrepliedMsgDetails={setrepliedMsgDetails}
          searchUserProfileAction={searchUserProfileAction}
          flatListRef={FlatListRef}
          channelType={channelType}
          index={index}
        />
      );
    },
    [
      chatState,
      userInfoState,
      orgState,
      deleteMessageAction,
      setreplyOnMessage,
      setrepliedMsgDetails,
    ],
  );

  const onEndReached = useCallback(() => {
    fetchChatsOfTeamAction(teamId, userInfoState?.accessToken, skip);
  }, [teamId, userInfoState, skip, fetchChatsOfTeamAction]);

  function renderNode(node, index, siblings, parent, defaultRenderer) {
    if (node.attribs?.class == 'mention') {
      return (
        <Text
          key={index}
          style={{color: 'black', textDecorationLine: 'underline'}}>
          @{node?.attribs?.['data-value']}
        </Text>
      );
    }
  }
  const htmlStyles = {
    div: {
      color: 'black',
    },
  };
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.mainContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={searchedChannel ? s(80) : offset}
          style={{flex: 1}}>
          <View style={styles.outerContainer}>
            <View style={styles.messageListContainer}>
              {teamId == undefined ||
              chatState?.data[teamId]?.isloading == true ? (
                <View style={styles.loadingContainer}>
                  <AnimatedLottieView
                    source={require('../../assests/images/attachments/loading.json')}
                    loop
                    autoPlay
                    style={styles.animatedLottieView}
                  />
                </View>
              ) : (
                <>
                  <Animated.FlatList
                    ref={FlatListRef}
                    data={memoizedData}
                    renderItem={renderItem}
                    inverted
                    ListFooterComponent={
                      chatState?.data[teamId]?.messages?.length > 15 &&
                      ListFooterComponent
                    }
                    onEndReached={
                      chatState?.data[teamId]?.messages?.length > 20 &&
                      onEndReached
                    }
                    onEndReachedThreshold={0.1}
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps="always"
                    onScroll={onScroll}
                  />
                </>
              )}
              {isScrolling && (
                <MaterialIcons
                  name="south"
                  style={styles.moveToBottom}
                  onPress={() => {
                    FlatListRef?.current?.scrollToIndex({index: 0});
                  }}
                />
              )}
            </View>
            {attachmentLoading && (
              <AnimatedLottieView
                source={require('../../assests/images/attachments/uploading.json')}
                loop
                autoPlay
                style={styles.attachmentLoading}
              />
            )}
            <View style={styles.bottomContainer}>
              <View
                style={[
                  replyOnMessage && styles.inputWithReplyContainer,
                  {width: '90%'},
                ]}>
                {attachment?.length > 0 &&
                  attachment?.map((item, index) => {
                    return (
                      <TouchableOpacity key={index}>
                        <View style={styles.replyMessageInInput}>
                          <Text style={styles.repliedText}>{item?.title}</Text>
                          <MaterialIcons
                            name="cancel"
                            size={ms(18)}
                            color={'black'}
                            onPress={() => {
                              const newAttachment = attachment.filter(
                                (_, i) => i !== index,
                              );
                              setAttachment(newAttachment);
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                {replyOnMessage && (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      setreplyOnMessage(false);
                      setrepliedMsgDetails(null);
                    }}>
                    <View style={styles.replyMessageInInput}>
                      {repliedMsgDetails?.mentions?.length > 0 ? (
                        <HTMLView
                          value={`<div>${repliedMsgDetails?.content}</div>`}
                          renderNode={renderNode}
                          stylesheet={htmlStyles}
                        />
                      ) : repliedMsgDetails?.attachment?.length > 0 &&
                        typeof repliedMsgDetails?.attachment != 'string' ? (
                        <Text style={{color: 'black'}}>
                          <Icon name="attach-file" size={16} color="black" />
                          attachment
                        </Text>
                      ) : (
                        <RenderHTML
                          source={{
                            html: repliedMsgDetails?.content?.replace(
                              emailRegex,
                              '<span>$&</span>',
                            ),
                          }}
                          contentWidth={width}
                          tagsStyles={tagsStyles('black', 'black')}
                        />
                      )}
                      <MaterialIcons
                        name="cancel"
                        size={ms(16)}
                        color="black"
                        style={{
                          position: 'absolute',
                          top: ms(5),
                          right: ms(5),
                          zIndex: 1,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={mentions}
                  renderItem={renderMention}
                  style={styles.mentionsList}
                  keyboardShouldPersistTaps="always"
                />

                <View style={styles.inputContainer}>
                  <View style={{justifyContent: 'center'}}>
                    {showOptions && (
                      <Animated.View
                        style={[
                          styles.optionsContainer,
                          {transform: [{translateX: optionsPosition}]},
                        ]}>
                        <View style={{flexDirection: 'row'}}>
                          <MaterialIcons
                            name="attach-file"
                            size={ms(20)}
                            style={styles.attachIcon}
                            onPress={() =>
                              pickDocument(
                                setAttachment,
                                userInfoState?.accessToken,
                                setAttachmentLoading,
                              )
                            }
                          />
                          <MaterialIcons
                            name="camera"
                            size={ms(20)}
                            style={styles.attachIcon}
                            onPress={() => {
                              launchCameraForPhoto(
                                userInfoState?.accessToken,
                                setAttachment,
                                setAttachmentLoading,
                              );
                            }}
                          />
                          <MaterialIcons
                            name="image"
                            size={ms(20)}
                            style={styles.attachIcon}
                            onPress={() => {
                              launchGallery(
                                userInfoState?.accessToken,
                                setAttachment,
                                setAttachmentLoading,
                              );
                            }}
                          />
                          <MaterialIcons
                            name="chevron-left"
                            size={ms(20)}
                            style={styles.attachIcon}
                            onPress={hideOptionsMethod}
                          />
                        </View>
                      </Animated.View>
                    )}
                  </View>

                  <View style={{justifyContent: 'center'}}>
                    {!showOptions && (
                      <MaterialIcons
                        name="add"
                        size={ms(20)}
                        style={styles.attachIcon}
                        onPress={showOptionsMethod}
                      />
                    )}
                  </View>
                  <TextInput
                    ref={textInputRef}
                    editable
                    multiline
                    onChangeText={handleInputChange}
                    placeholder="Message"
                    placeholderTextColor={colors.textColor}
                    value={message}
                    style={[
                      replyOnMessage
                        ? styles.inputWithReply
                        : styles.inputWithoutReply,
                      {color: colors.textColor},
                    ]}
                  />
                  {showOptions &&
                    message?.html?.trim()?.length == 1 &&
                    hideOptionsMethod()}
                </View>
              </View>
              <View style={{justifyContent: 'flex-end'}}>
                <MaterialIcons
                  name="send"
                  size={ms(25)}
                  style={{color: colors.textColor, padding: ms(10)}}
                  onPress={() => {
                    let randomId = uuid.v4();
                    networkState?.isInternetConnected
                      ? (message?.trim() != '' || attachment?.length > 0) &&
                        (onChangeMessage(''),
                        setAttachment([]),
                        setlocalMsgAction({
                          randomId: randomId,
                          content: message,
                          createdAt: date,
                          isLink: false,
                          mentions: mentionsArr,
                          orgId: orgState?.currentOrgId,
                          parentId: repliedMsgDetails?._id,
                          senderId: userInfoState?.user?.id,
                          senderType: 'APP',
                          teamId: teamId,
                          updatedAt: date,
                          attachment: attachment,
                          mentionsArr: mentionsArr,
                          parentMessage: repliedMsgDetails?.content,
                        }),
                        sendMessageAction(
                          message,
                          teamId,
                          orgState?.currentOrgId,
                          userInfoState?.user?.id,
                          userInfoState?.accessToken,
                          repliedMsgDetails?._id || null,
                          attachment,
                          mentionsArr,
                        ),
                        hideOptionsMethod(),
                        setMentionsArr(''),
                        setMentions([]),
                        replyOnMessage && setreplyOnMessage(false),
                        repliedMsgDetails && setrepliedMsgDetails(null))
                      : message?.trim() != '' &&
                        (onChangeMessage(''),
                        setlocalMsgAction({
                          randomId: randomId,
                          content: message,
                          createdAt: date,
                          isLink: false,
                          mentions: mentionsArr,
                          orgId: orgState?.currentOrgId,
                          parentId: repliedMsgDetails?._id,
                          senderId: userInfoState?.user?.id,
                          senderType: 'APP',
                          teamId: teamId,
                          updatedAt: date,
                          attachment: attachment,
                          mentionsArr: mentionsArr,
                          parentMessage: repliedMsgDetails?.content,
                        }),
                        setGlobalMessageToSendAction({
                          content: message,
                          teamId: teamId,
                          orgId: orgState?.currentOrgId,
                          senderId: userInfoState?.user?.id,
                          userId: userInfoState?.user?.id,
                          accessToken: userInfoState?.accessToken,
                          parentId: repliedMsgDetails?.id || null,
                          updatedAt: date,
                          mentionsArr: mentionsArr,
                        }),
                        hideOptionsMethod(),
                        setMentionsArr(''),
                        setMentions([]),
                        replyOnMessage && setreplyOnMessage(false),
                        repliedMsgDetails && setrepliedMsgDetails(null));
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};
const mapStateToProps = state => ({
  networkState: state.networkReducer,
  userInfoState: state.userInfoReducer,
  orgState: state.orgsReducer,
  chatState: state.chatReducer,
  channelsState: state.channelsReducer,
  channelsByQueryState: state.channelsByQueryReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChatsOfTeamAction: (teamId, token, skip) =>
      dispatch(getChatsStart(teamId, token, skip)),
    sendMessageAction: (
      message,
      teamId,
      orgId,
      senderId,
      token,
      parentId,
      attachment,
      mentionsArr,
    ) =>
      dispatch(
        sendMessageStart(
          message,
          teamId,
          orgId,
          senderId,
          token,
          parentId,
          attachment,
          mentionsArr,
        ),
      ),
    setlocalMsgAction: data => dispatch(setLocalMsgStart(data)),
    deleteMessageAction: (accessToken, msgId) =>
      dispatch(deleteMessageStart(accessToken, msgId)),
    setActiveChannelTeamIdAction: teamId =>
      dispatch(setActiveChannelTeamId(teamId)),
    setGlobalMessageToSendAction: messageObj =>
      dispatch(setGlobalMessageToSend(messageObj)),
    getChannelsByQueryStartAction: (query, userToken, orgId) =>
      dispatch(getChannelsByQueryStart(query, userToken, orgId)),
    searchUserProfileAction: (userId, token) =>
      dispatch(fetchSearchedUserProfileStart(userId, token)),
    resetUnreadCountAction: (
      orgId,
      userId,
      teamId,
      accessToken,
      badgeCount,
      unreadCount,
    ) =>
      dispatch(
        resetUnreadCountStart(
          orgId,
          userId,
          teamId,
          accessToken,
          badgeCount,
          unreadCount,
        ),
      ),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

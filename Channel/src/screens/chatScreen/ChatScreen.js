import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import uuid from 'react-native-uuid';
import {
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  SafeAreaView,
  useWindowDimensions,
  Platform,
  StyleSheet,
  RefreshControl,
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
import {makeStyles} from './Styles';
import {useNavigationState, useTheme} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import {ms} from 'react-native-size-matters';
import {setLocalMsgStart} from '../../redux/actions/chat/LocalMessageActions';
import {resetUnreadCountStart} from '../../redux/actions/channels/ChannelsAction';
import HTMLView from 'react-native-htmlview';
import RenderHTML from 'react-native-render-html';
import {tagsStyles} from './HtmlStyles';
import {onStartRecord, onStopRecord} from './VoiceRecording';
import RNFetchBlob from 'rn-fetch-blob';
import {uploadRecording} from './VoicePicker';
import {
  addUserToChannelStart,
  removeUserFromChannelStart,
} from '../../redux/actions/channelActivities/inviteUserToChannelAction';
import {ACTIVITIES, DEVICE_TYPES} from '../../constants/Constants';
import ScrollDownButton from '../../components/ScrollDownButton';
import AudioRecordingPlayer from '../../components/AudioRecorderPlayer';
import AppProvider from '../appProvider/AppProvider';
import FirstTabChatScreen from './FirstTabChatScreen';
import ActivityList from './components/ActivityList';
import MentionList from './components/MentionList';
import ActionModal from './components/ActionModal';
import {Button} from 'react-native-paper';
import AttachmentOptions from './components/AttachmentOptions';

const ChatScreen = ({
  chatDetailsForTab,
  setChatDetailsForTab,
  deviceType,
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
  addUsersToChannelAction,
  removeUserFromChannelAction,
  socketState,
}) => {
  var teamId, channelType;
  if (deviceType === DEVICE_TYPES[1]) {
    teamId = chatDetailsForTab?.teamId;
    channelType = chatDetailsForTab?.channelType;
  } else {
    var {teamId, reciverUserId, channelType, searchedChannel} = route.params;
  }

  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }

  if (teamId == 'demo') {
    return <FirstTabChatScreen />;
  }
  useEffect(() => {
    const fetchData = () => {
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
      setActiveChannelTeamIdAction(teamId);
    };
    if (
      !chatState?.data[teamId]?.messages ||
      chatState?.data[teamId]?.messages.length === 0
    ) {
      fetchData();
    } else if (chatState?.data[teamId]?.messages?.length > 0) {
      const timeoutId = setTimeout(fetchData, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [networkState?.isInternetConnected, teamId, chatDetailsForTab]);
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [currentSelectChatCard, setCurrentSelectedChatCard] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [message, onChangeMessage] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [attachmentLoading, setAttachmentLoading] = useState(false);
  const [showMention, setshowMention] = useState(false);
  const [mentionsArr, setMentionsArr] = useState([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mentions, setMentions] = useState([]);
  const FlatListRef = useRef(null);
  const textInputRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const {height} = Dimensions.get('window');
  const offset = height * 0.12;
  const screenHeight = Dimensions.get('window').height;
  const {width} = useWindowDimensions();
  const date = useMemo(() => new Date(), []);
  const [recordingUrl, setrecordingUrl] = useState('');
  const [isRecording, setisRecording] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);
  const [voiceAttachment, setvoiceAttachment] = useState('');
  const [Activities, setActivities] = useState(false);
  const [action, setaction] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigationState = useNavigationState(state => state);
  const isMountedRef = useRef(true);

  const teamIdAndUnreadCountMapping =
    channelsState?.teamIdAndUnreadCountMapping;
  const teamIdAndBadgeCountMapping = channelsState?.teamIdAndBadgeCountMapping;
  const user = userInfoState?.user;
  const accessToken = userInfoState?.accessToken;
  const currentOrgId = orgState?.currentOrgId;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const shouldResetUnreadCount =
    teamIdAndUnreadCountMapping?.[teamId] > 0 ||
    teamIdAndBadgeCountMapping?.[teamId] > 0;
  const skip = chatState?.data[teamId]?.messages?.length ?? 0;

  const path = Platform.select({
    ios: `sound.m4a`,
    android: `${RNFetchBlob.fs.dirs.CacheDir}/sound.mp3`,
  });

  useEffect(() => {
    return () => {
      // Set the mounted state to false when the component is unmounted
      isMountedRef.current = false;
      onStopRecord(setrecordingUrl, setvoiceAttachment, isMountedRef);
      setisRecording(false);
    };
  }, [navigationState]);

  useEffect(() => {
    if (repliedMsgDetails != '' && !showPlayer) {
      textInputRef.current.focus();
    }
  }, [repliedMsgDetails]);

  useEffect(() => {
    searchedChannel && textInputRef?.current?.focus();
    const timeoutId = setTimeout(() => {
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
    return () => clearTimeout(timeoutId);
  }, [teamId]);

  useEffect(() => {
    if (channelsByQueryState?.mentionChannels) {
      setMentions(channelsByQueryState?.mentionChannels);
    } else {
      setMentions([]);
    }
  }, [channelsByQueryState?.mentionChannels]);

  const handleInputChange = useCallback(
    async text => {
      onChangeMessage(text);
      const words = text.split(' ');
      const currentWord = words[words.length - 1];
      if (currentWord.startsWith('@')) {
        await getChannelsByQueryStartAction(
          currentWord.slice(1),
          userInfoState?.user?.id,
          orgState?.currentOrgId,
        );
        // setMentions(channelsByQueryState?.mentionChannels);
        setshowMention(true);
      } else if (
        words[0].startsWith('/') &&
        words.length === 1 &&
        !['DIRECT_MESSAGE', 'PERSONAL'].includes(channelType)
      ) {
        setActivities(true);
        setMentions([]);
        setshowMention(false);
      } else {
        setMentions([]);
        setActivities(false);
        setshowMention(false);
      }
    },
    [
      onChangeMessage,
      channelsByQueryState?.mentionChannels,
      userInfoState?.user?.id,
      orgState?.currentOrgId,
    ],
  );

  const scrollToBottom = () => {
    FlatListRef?.current?.scrollToOffset({animating: true, offset: 0});
  };

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: ({nativeEvent}) => {
        const offsetY = nativeEvent.contentOffset.y;
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
          networkState={networkState}
          deleteMessageAction={deleteMessageAction}
          chatState={chatState}
          setreplyOnMessage={setreplyOnMessage}
          setrepliedMsgDetails={setrepliedMsgDetails}
          searchUserProfileAction={searchUserProfileAction}
          flatListRef={FlatListRef}
          channelType={channelType}
          index={index}
          setShowActions={setShowActions}
          setCurrentSelectedChatCard={setCurrentSelectedChatCard}
          setChatDetailsForTab={setChatDetailsForTab}
        />
      );
    },
    [chatState, userInfoState, orgState, deleteMessageAction],
  );

  const onEndReached = useCallback(() => {
    fetchChatsOfTeamAction(teamId, userInfoState?.accessToken, skip);
  }, [teamId, userInfoState?.accessToken, skip, fetchChatsOfTeamAction]);

  function renderNode(node, index, siblings, parent, defaultRenderer) {
    const attribs = node?.attribs;
    if (attribs?.class === 'mention') {
      const dataValue = attribs['data-value'];
      return (
        <Text
          key={index}
          style={{color: 'black', textDecorationLine: 'underline'}}>
          @{dataValue}
        </Text>
      );
    }
  }

  const handleRefresh = () => {
    setRefreshing(true);
    fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const htmlStyles = {
    div: {
      color: 'black',
    },
  };

  const onSendWithAction = () => {
    onChangeMessage('');
    const hasMentions = mentionsArr?.length > 0;
    if (action == ACTIVITIES[0]?.name && hasMentions) {
      addUsersToChannelAction(
        mentionsArr,
        teamId,
        orgState?.currentOrgId,
        userInfoState?.accessToken,
      );
    } else if (action == ACTIVITIES[1]?.name && hasMentions) {
      removeUserFromChannelAction(
        mentionsArr,
        teamId,
        orgState?.currentOrgId,
        userInfoState?.accessToken,
      );
    }
    setaction('');
    setMentions([]);
    setMentionsArr([]);
  };

  const onSendPress = async () => {
    const localMessage = message;
    onChangeMessage('');

    if (localMessage?.trim() !== '' || showPlayer || attachment?.length > 0) {
      const randomId = uuid.v4();
      const messageContent = {
        randomId: randomId,
        content: localMessage,
        createdAt: date,
        isLink: false,
        mentions: mentionsArr,
        orgId: orgState?.currentOrgId,
        parentId: repliedMsgDetails?._id,
        senderId: userInfoState?.user?.id,
        senderType: 'APP',
        teamId: teamId,
        updatedAt: date,
        attachment: showPlayer ? voiceAttachment : attachment,
        mentionsArr: mentionsArr,
        parentMessage: repliedMsgDetails?.content,
      };
      setlocalMsgAction(messageContent);

      if (networkState?.isInternetConnected || showPlayer) {
        let response;
        if (showPlayer) {
          response = await uploadRecording(recordingUrl, accessToken);
        }
        sendMessageAction(
          localMessage,
          teamId,
          orgState?.currentOrgId,
          userInfoState?.user?.id,
          userInfoState?.accessToken,
          repliedMsgDetails?._id || null,
          attachment?.length > 0 ? attachment : response || [],
          mentionsArr,
        );
      } else {
        setGlobalMessageToSendAction({
          content: localMessage,
          teamId: teamId,
          orgId: orgState?.currentOrgId,
          senderId: userInfoState?.user?.id,
          userId: userInfoState?.user?.id,
          accessToken: userInfoState?.accessToken,
          parentId: repliedMsgDetails?.id || null,
          updatedAt: date,
          mentionsArr: mentionsArr,
        });
      }
    }

    attachment?.length > 0 && setAttachment([]),
      showOptions && setShowOptions(false),
      mentionsArr?.length > 0 && setMentionsArr(''),
      mentions?.length > 0 && setMentions([]),
      replyOnMessage && setreplyOnMessage(false),
      repliedMsgDetails && setrepliedMsgDetails(null);
    showPlayer && setShowPlayer(false);
  };

  return (
    <AppProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={searchedChannel ? 75 : offset}
            style={{flex: 1}}>
            <View style={styles.outerContainer}>
              <View style={styles.messageListContainer}>
                {teamId == undefined ||
                chatState?.data[teamId]?.isloading == true ? (
                  <View style={styles.loadingContainer}>
                    <Text style={{color: colors?.color, textAlign: 'center'}}>
                      Loading...
                    </Text>
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
                      showsVerticalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          refreshing={refreshing}
                          onRefresh={handleRefresh}
                        />
                      }
                    />
                  </>
                )}
                <ScrollDownButton
                  scrollToBottom={scrollToBottom}
                  isVisible={isScrolling}
                  isNewMessage={false}
                />
              </View>

              {attachmentLoading && (
                <AnimatedLottieView
                  source={require('../../assests/images/attachments/uploading.json')}
                  loop
                  autoPlay
                  style={styles.attachmentLoading}
                />
              )}

              {showActions && (
                <ActionModal
                  setShowActions={setShowActions}
                  chat={currentSelectChatCard}
                  userInfoState={userInfoState}
                  orgState={orgState}
                  deleteMessageAction={deleteMessageAction}
                  chatState={chatState}
                  setreplyOnMessage={setreplyOnMessage}
                  setrepliedMsgDetails={setrepliedMsgDetails}
                  searchUserProfileAction={searchUserProfileAction}
                  flatListRef={FlatListRef}
                  channelType={channelType}
                  setCurrentSelectedChatCard={setCurrentSelectedChatCard}
                  currentSelectChatCard={currentSelectChatCard}
                />
              )}

              <View style={styles.bottomContainer}>
                <View
                  style={[
                    replyOnMessage && styles.inputWithReplyContainer,
                    {width: isRecording ? '100%' : '87%'},
                  ]}>
                  {attachment?.length > 0 &&
                    attachment?.map((item, index) => {
                      return (
                        <TouchableOpacity key={index}>
                          <View style={styles.replyMessageInInput}>
                            <Text style={styles.repliedText}>
                              {item?.title}
                            </Text>
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
                        {repliedMsgDetails?.content?.includes(
                          '<span class="mention"',
                        ) ? (
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

                  {showMention && (
                    <MentionList
                      data={mentions}
                      setMentionsArr={setMentionsArr}
                      onChangeMessage={onChangeMessage}
                      setMentions={setMentions}
                      orgsState={orgState}
                    />
                  )}

                  {Activities && (
                    <ActivityList
                      setaction={setaction}
                      onChangeMessage={onChangeMessage}
                      setActivities={setActivities}
                    />
                  )}

                  {showPlayer && (
                    <View style={styles.playerContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          minHeight: 60,
                          // maxHeight: ms(200),

                          flex: 1,
                          alignItems: 'center',
                        }}>
                        <AudioRecordingPlayer remoteUrl={path} />
                      </View>
                      <MaterialIcons
                        name="cancel"
                        size={ms(18)}
                        color={colors?.textColor}
                        onPress={() => {
                          setShowPlayer(false);
                        }}
                      />
                    </View>
                  )}

                  {!showPlayer && (
                    <View style={styles.inputContainer}>
                      {isRecording ? (
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View style={{flex: 1, alignItems: 'center'}}>
                            <AnimatedLottieView
                              source={require('../../assests/images/attachments/recording.json')}
                              loop
                              autoPlay
                              style={{width: 100, height: 100}}
                            />
                          </View>
                          <Button
                            mode="contained"
                            icon="microphone-off"
                            buttonColor="#756EF6"
                            onPress={() => {
                              onStopRecord(
                                setrecordingUrl,
                                setvoiceAttachment,
                                isMountedRef,
                              ),
                                setisRecording(false),
                                setShowPlayer(true);
                            }}>
                            STOP
                          </Button>
                        </View>
                      ) : (
                        <>
                          <AttachmentOptions
                            accessToken={accessToken}
                            setAttachment={setAttachment}
                            setAttachmentLoading={setAttachmentLoading}
                            showOptions={showOptions}
                            setShowOptions={setShowOptions}
                          />
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
                        </>
                      )}
                      {showOptions &&
                        message?.length == 1 &&
                        setShowOptions(false)}
                    </View>
                  )}
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    // flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                  }}>
                  {message?.length > 0 ||
                  showPlayer ||
                  attachment?.length > 0 ? (
                    <TouchableOpacity
                      onPress={!action ? onSendPress : onSendWithAction}>
                      <MaterialIcons
                        name="send"
                        size={25}
                        style={{
                          color: colors.textColor,
                          padding: 15,
                        }}
                      />
                    </TouchableOpacity>
                  ) : (
                    !isRecording && (
                      <MaterialIcons
                        name="mic"
                        size={25}
                        style={{color: colors.textColor, padding: 15}}
                        onPress={() => {
                          onStartRecord(setisRecording);
                        }}
                      />
                    )
                  )}
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </AppProvider>
  );
};
const mapStateToProps = state => ({
  networkState: state.networkReducer,
  userInfoState: state.userInfoReducer,
  orgState: state.orgsReducer,
  chatState: state.chatReducer,
  channelsState: state.channelsReducer,
  channelsByQueryState: state.channelsByQueryReducer,
  socketState: state.socketReducer,
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
    removeUserFromChannelAction: (userIds, teamId, orgId, accessToken) =>
      dispatch(removeUserFromChannelStart(userIds, teamId, orgId, accessToken)),
    addUsersToChannelAction: (userIds, teamId, orgId, accessToken) =>
      dispatch(addUserToChannelStart(userIds, teamId, orgId, accessToken)),
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
const styless = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
});

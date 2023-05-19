import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
  Platform,
  Image,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
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
import {onStartRecord, onStopRecord} from './VoiceRecording';
import RNFetchBlob from 'rn-fetch-blob';
import {uploadRecording} from './VoicePicker';
import {
  addUserToChannelStart,
  removeUserFromChannelStart,
} from '../../redux/actions/channelActivities/inviteUserToChannelAction';
import {ACTIVITIES, DEVICE_TYPES} from '../../constants/Constants';
import ScrollDownButton from '../../components/ScrollDownButton';
import {ActionMessageCardMemo} from './ActionMessageCard';
import OptionList from './OptionList';
import AudioRecordingPlayer from '../../components/AudioRecorderPlayer';
import AppProvider, {AppContext} from '../appProvider/AppProvider';
import FirstTabChatScreen from './FirstTabChatScreen';

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
}) => {
  var teamId, channelType;
  if (deviceType === DEVICE_TYPES[1]) {
    teamId = chatDetailsForTab?.teamId;
    channelType = chatDetailsForTab?.channelType;
  } else {
    var {teamId, reciverUserId, channelType, searchedChannel} = route.params;
  }

  if (teamId == 'demo') {
    return <FirstTabChatScreen />;
  }
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioDataUrl, setAudioDataUrl] = useState('');
  const [voiceAttachment, setvoiceAttachment] = useState('');
  const [Activities, setActivities] = useState(false);
  const [action, setaction] = useState(null);
  const teamIdAndUnreadCountMapping =
    channelsState?.teamIdAndUnreadCountMapping;
  const teamIdAndBadgeCountMapping = channelsState?.teamIdAndBadgeCountMapping;
  const user = userInfoState?.user;
  const accessToken = userInfoState?.accessToken;
  const currentOrgId = orgState?.currentOrgId;
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  const path = Platform.select({
    ios: `sound.m4a`,
    android: `${RNFetchBlob.fs.dirs.CacheDir}/sound.mp3`,
  });
  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  const shouldResetUnreadCount =
    teamIdAndUnreadCountMapping?.[teamId] > 0 ||
    teamIdAndBadgeCountMapping?.[teamId] > 0;

  useEffect(() => {
    if (repliedMsgDetails != '' && !showPlayer) {
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
  }, [teamId]);

  useEffect(() => {
    if (
      chatState?.data[teamId]?.messages == undefined ||
      chatState?.data[teamId]?.messages == [] ||
      (!chatState?.data[teamId]?.apiCalled && networkState?.isInternetConnected)
    ) {
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
    setActiveChannelTeamIdAction(teamId);
  }, [networkState?.isInternetConnected, teamId, chatDetailsForTab]);

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
  //  const [activities, setActivities] = useState([]);

  const handleInputChange = useCallback(
    text => {
      onChangeMessage(text);
      const words = text.split(' ');
      const currentWord = words[words.length - 1];
      if (currentWord.startsWith('@')) {
        getChannelsByQueryStartAction(
          currentWord.replace('@', ''),
          userInfoState?.user?.id,
          orgState?.currentOrgId,
        );
        setMentions(channelsByQueryState?.mentionChannels);
      } else if (
        words[0].startsWith('/') &&
        words.length === 1 &&
        channelType != 'DIRECT_MESSAGE' &&
        channelType != 'PERSONAL'
      ) {
        setActivities(true);
        setMentions([]);
      } else {
        setMentions([]);
        setActivities(false);
      }
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
          new RegExp(`@\\w*\\s?$`),
          `@${mention?._source?.displayName} `,
        ),
      );
    setMentions([]);
  };

  const handleActionSelect = action => {
    setaction(action);
    onChangeMessage(prevmessage =>
      prevmessage.replace(new RegExp(`/\\w*\\s?$`), `/${action} `),
    );
    setActivities(false);
  };

  const scrollToBottom = () => {
    FlatListRef?.current?.scrollToOffset({animating: true, offset: 0});
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
  const renderActions = useMemo(
    () =>
      ({item, index}) =>
        (
          <TouchableOpacity
            onPress={() => handleActionSelect(item?.name)}
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
              <Image
                source={require('../../assests/images/appIcon/icon48size.png')}
                style={{height: 30, width: 30}}
              />
              <View>
                <Text
                  style={{fontSize: 16, margin: 4, color: colors.textColor}}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginLeft: 4,
                    color: colors.textColor,
                  }}>
                  {item?.desc}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
    [handleActionSelect],
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
          setShowActions={setShowActions}
          setCurrentSelectedChatCard={setCurrentSelectedChatCard}
          setChatDetailsForTab={setChatDetailsForTab}
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

  const onSendPress = async () => {
    let response;
    const localMessage = message;
    onChangeMessage('');
    if (action == 'Invite') {
      addUsersToChannelAction(
        mentionsArr,
        teamId,
        orgState?.currentOrgId,
        userInfoState?.accessToken,
      );
      setaction('');
      setMentions([]);
      setMentionsArr([]);
    } else if (action == 'Remove') {
      removeUserFromChannelAction(
        mentionsArr,
        teamId,
        orgState?.currentOrgId,
        userInfoState?.accessToken,
      );
      setaction('');
      setMentions([]);
      setMentionsArr([]);
    } else {
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

      if (
        networkState?.isInternetConnected &&
        (localMessage?.trim() !== '' || attachment?.length > 0 || showPlayer)
      ) {
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
        ),
          attachment?.length > 0 && setAttachment([]),
          showOptions && hideOptionsMethod(),
          mentionsArr?.length > 0 && setMentionsArr(''),
          mentions?.length > 0 && setMentions([]),
          replyOnMessage && setreplyOnMessage(false),
          repliedMsgDetails && setrepliedMsgDetails(null);
        showPlayer && setShowPlayer(false);
      } else if (localMessage?.trim() !== '') {
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
        }),
          attachment?.length > 0 && setAttachment([]),
          showOptions && hideOptionsMethod(),
          mentionsArr?.length > 0 && setMentionsArr(''),
          mentions?.length > 0 && setMentions([]),
          replyOnMessage && setreplyOnMessage(false),
          repliedMsgDetails && setrepliedMsgDetails(null);
        showPlayer && setShowPlayer(false);
      }
    }
  };
  return (
    <AppProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : null}
            keyboardVerticalOffset={searchedChannel ? 80 : offset}
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
                <Modal
                  animationType="fade"
                  transparent={true}
                  onRequestClose={() => setShowActions(false)}
                  style={{flex: 1}}>
                  <TouchableWithoutFeedback
                    onPress={() => setShowActions(false)}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      }}>
                      <TouchableWithoutFeedback
                        onPress={() => setShowActions(false)}>
                        <View
                          style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <ActionMessageCardMemo
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
                            setShowActions={setShowActions}
                            setCurrentSelectedChatCard={
                              setCurrentSelectedChatCard
                            }
                          />
                          <OptionList
                            sentByMe={true}
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
                  {Activities && (
                    <FlatList
                      data={ACTIVITIES}
                      renderItem={renderActions}
                      style={styles.mentionsList}
                      keyboardShouldPersistTaps="always"
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
                        <View style={{flex: 1, minHeight: 40}}>
                          <AnimatedLottieView
                            source={require('../../assests/images/attachments/recordingWave.json')}
                            loop
                            autoPlay
                          />
                        </View>
                      ) : (
                        <>
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
                        </>
                      )}
                      {showOptions &&
                        message?.html?.trim()?.length == 1 &&
                        hideOptionsMethod()}
                    </View>
                  )}
                </View>
                <View style={{justifyContent: 'flex-end'}}>
                  {message?.length > 0 ||
                  showPlayer ||
                  attachment?.length > 0 ? (
                    <MaterialIcons
                      name="send"
                      size={ms(25)}
                      style={{color: colors.textColor, padding: ms(10)}}
                      onPress={onSendPress}
                    />
                  ) : !isRecording ? (
                    <MaterialIcons
                      name="mic"
                      size={ms(25)}
                      style={{color: colors.textColor, padding: ms(10)}}
                      onPress={() => {
                        onStartRecord(setisRecording);
                      }}
                    />
                  ) : (
                    <MaterialIcons
                      name="mic-off"
                      size={25}
                      style={{color: colors.textColor, padding: ms(10)}}
                      onPress={() => {
                        onStopRecord(setrecordingUrl, setvoiceAttachment),
                          setisRecording(false),
                          setShowPlayer(true);
                      }}
                    />
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

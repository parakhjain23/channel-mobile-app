import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  useWindowDimensions,
} from 'react-native';
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
import {ChatCardMemo, LocalChatCardMemo} from './ChatCard';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import {renderTextWithLinks} from './RenderTextWithLinks';
import {pickDocument} from './DocumentPicker';
import {launchCameraForPhoto, launchGallery} from './ImagePicker';
import {makeStyles} from './Styles';
import {useTheme} from '@react-navigation/native';

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
}) => {
  var {teamId, reciverUserId} = route.params;
  const {colors} = useTheme();
  const styles = makeStyles(colors);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [message, onChangeMessage] = useState(null);
  const [attachment, setAttachment] = useState([]);
  const [localMsg, setlocalMsg] = useState([]);
  const FlatListRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [mentionsArr, setMentionsArr] = useState([]);
  const {width} = useWindowDimensions();

  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  useEffect(() => {
    localMsg?.shift();
  }, [chatState?.data[teamId]?.messages]);
  const skip =
    chatState?.data[teamId]?.messages?.length != undefined
      ? chatState?.data[teamId]?.messages?.length
      : 0;
  useEffect(() => {
    if (
      chatState?.data[teamId]?.messages == undefined ||
      chatState?.data[teamId]?.messages == [] ||
      (!chatState?.data[teamId]?.apiCalled && networkState?.isInternetConnected)
    ) {
      console.log('api called');
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

  const handleInputChange = text => {
    onChangeMessage(text);
    const mentionRegex = /@\w+/g;
    const foundMentions = text.match(mentionRegex);

    foundMentions?.length > 0
      ? (getChannelsByQueryStartAction(
          foundMentions?.[foundMentions?.length - 1].replace('@', ''),
          userInfoState?.user?.id,
          orgState?.currentOrgId,
        ),
        setMentions(channelsByQueryState?.channels || []))
      : setMentions([]);
  };

  const handleMentionSelect = mention => {
    setMentionsArr(prevUserIds => [...prevUserIds, mention?._source?.userId]);
    onChangeMessage(prevmessage =>
      prevmessage.replace(
        new RegExp(`@\\w+\\s?$`),
        `@${mention?._source?.displayName} `,
      ),
    );
    setMentions([]);
  };
  const renderMention = ({item, index}) =>
    item?._source?.type == 'U' && (
      <TouchableOpacity onPress={() => handleMentionSelect(item)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0.7,
            borderTopColor: 'grey',
            margin: 2,
            padding: 2,
          }}>
          <MaterialIcons name="account-circle" size={20} color={colors.textColor}/>
          <Text key={index} style={{fontSize: 16, margin: 4, color: colors.textColor}}>
            {item?._source?.displayName}
          </Text>
        </View>
      </TouchableOpacity>
    );

  const onScroll = Animated.event(
    [{nativeEvent: {contentOffset: {y: scrollY}}}],
    {
      useNativeDriver: true,
      listener: event => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolling(offsetY > 0);
      },
    },
  );
  const memoizedData = useMemo(
    () => chatState?.data[teamId]?.messages || [],
    [chatState?.data[teamId]?.messages],
  );

  const renderItem = useCallback(
    ({item, index}) => (
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
      />
    ),
    [
      chatState,
      userInfoState,
      orgState,
      deleteMessageAction,
      setreplyOnMessage,
      setrepliedMsgDetails,
    ],
  );
  const renderItemLocal = useCallback(
    ({item, index}) => (
      <LocalChatCardMemo
        chat={item}
        userInfoState={userInfoState}
        orgState={orgState}
        deleteMessageAction={deleteMessageAction}
        chatState={chatState}
        setreplyOnMessage={setreplyOnMessage}
        setrepliedMsgDetails={setrepliedMsgDetails}
      />
    ),
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
  const date = new Date();
  return (
    <View style={styles.mainContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={70}
        style={{flex: 1}}>
        <View style={{flex: 1, marginLeft: 10}}>
          <View style={{flex: 9}}>
            {teamId == undefined ||
            chatState?.data[teamId]?.isloading == true ? (
              <ActivityIndicator />
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
                  onEndReachedThreshold={0.2}
                  keyboardDismissMode="on-drag"
                  keyboardShouldPersistTaps="always"
                  onScroll={onScroll}
                />
                {localMsg?.length > 0 && (
                  <FlatList data={localMsg} renderItem={renderItemLocal} />
                )}
                {chatState?.data[teamId]?.globalMessagesToSend?.length > 0 && (
                  <FlatList
                    data={chatState?.data[teamId]?.globalMessagesToSend}
                    renderItem={renderItemLocal}
                  />
                )}
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
          {!networkState?.isInternetConnected && (
            <View>
              <Text style={{textAlign: 'center'}}>No Internet Connected!!</Text>
            </View>
          )}
          <View style={{margin: 8, marginLeft: 0}}>
            <View style={{flexDirection: 'row'}}>
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
                          <Text style={styles.text}>{item?.title}</Text>
                          <MaterialIcons
                            name="cancel"
                            size={18}
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
                  <TouchableOpacity onPress={() => setreplyOnMessage(false)}>
                    <View style={styles.replyMessageInInput}>
                      {repliedMsgDetails?.mentions?.length > 0 ? (
                        renderTextWithLinks(
                          repliedMsgDetails?.content,
                          repliedMsgDetails?.mentions,
                          userInfoState?.accessToken,
                          orgState,
                          width,
                        )
                      ) : (
                        <Text style={styles.text}>
                          {repliedMsgDetails?.content}
                        </Text>
                      )}
                      <MaterialIcons name="cancel" size={16} />
                    </View>
                  </TouchableOpacity>
                )}
                <FlatList
                  data={mentions}
                  keyExtractor={index => index.toString()}
                  renderItem={renderMention}
                  style={{maxHeight: 140}}
                  keyboardShouldPersistTaps="always"
                />

                <View style={styles.inputContainer}>
                  {showOptions && (
                    <Animated.View
                      style={[
                        styles.optionsContainer,
                        {transform: [{translateX: optionsPosition}]},
                      ]}>
                      <View style={{flexDirection: 'row'}}>
                        <MaterialIcons
                          name="attach-file"
                          size={20}
                          style={styles.attachIcon}
                          onPress={() =>
                            pickDocument(
                              setAttachment,
                              userInfoState?.accessToken,
                            )
                          }
                        />
                        <MaterialIcons
                          name="camera"
                          size={20}
                          style={styles.attachIcon}
                          onPress={() => {
                            launchCameraForPhoto(
                              userInfoState?.accessToken,
                              setAttachment,
                            );
                          }}
                        />
                        <MaterialIcons
                          name="image"
                          size={20}
                          style={styles.attachIcon}
                          onPress={() => {
                            launchGallery(
                              userInfoState?.accessToken,
                              setAttachment,
                            );
                          }}
                        />
                        <MaterialIcons
                          name="chevron-left"
                          size={20}
                          style={styles.attachIcon}
                          onPress={hideOptionsMethod}
                          // onPress={() => setShowOptions(false)}
                        />
                      </View>
                    </Animated.View>
                  )}
                  {!showOptions && (
                    <MaterialIcons
                      name="add"
                      size={20}
                      style={styles.attachIcon}
                      onPress={showOptionsMethod}
                      // onPress={() => setShowOptions(!showOptions)}
                    />
                  )}

                  <TextInput
                    editable
                    multiline
                    onChangeText={handleInputChange}
                    // onChangeText={text => onChangeMessage(text)}
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
                    message?.trim()?.length == 1 &&
                    hideOptionsMethod()}
                </View>
              </View>
              <View style={{justifyContent: 'flex-end'}}>
                <MaterialIcons
                  name="send"
                  size={25}
                  style={{color: colors.textColor, padding: 10}}
                  onPress={() => {
                    networkState?.isInternetConnected
                      ? (message?.trim() != '' || attachment?.length > 0) &&
                        (onChangeMessage(''),
                        setAttachment([]),
                        setlocalMsg([
                          ...localMsg,
                          {
                            content: message,
                            createdAt: date,
                            isLink: false,
                            mentions: mentionsArr,
                            orgId: orgState?.currentOrgId,
                            parentId: repliedMsgDetails?._id,
                            senderId: userInfoState?.user?.id,
                            senderType: 'APP',
                            teamId: '63e09e1f0916f000183a9d87',
                            updatedAt: date,
                          },
                        ]),
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
                        // onChangeMessage('');
                        hideOptionsMethod(),
                        setMentionsArr(''),
                        setMentions([]),
                        replyOnMessage && setreplyOnMessage(false),
                        repliedMsgDetails && setrepliedMsgDetails(null))
                      : message?.trim() != '' &&
                        (onChangeMessage(''),
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
        </View>
      </KeyboardAvoidingView>
    </View>
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
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
// import {ImagePicker} from 'react-native-image-picker'
import {launchCamera,launchImageLibrary} from 'react-native-image-picker'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
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
import DocumentPicker from 'react-native-document-picker';
import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {fetchSearchedUserProfileStart} from '../../redux/actions/user/searchUserProfileActions';
import {renderTextWithLinks} from './RenderTextWithLinks';

const pickDocument = async (setAttachment, accessToken) => {
  try {
    const Files = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection: true,
      readContent: true,
    });
    console.log(Files,"this is files");
    try {
      const FileNames = await FileUploadApi(Files, accessToken);
      const attachment = FileNames?.map((file, index) => {
        return {
          title: Files[index]?.name,
          key: file,
          resourceUrl: `https://resources.intospace.io/${file}`,
          contentType: Files[index]?.type,
          size: 18164,
          encoding: '',
        };
      });
      setAttachment(prevAttachment => [...prevAttachment, ...attachment]);
    } catch (error) {
      console.log(error, 'error');
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      console.log('User cancelled document picker');
    } else {
      console.log('DocumentPicker Error: ', err);
    }
  }
};
const launchCameraForPhoto = () => {
  const optionsForCamera = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };
  launchCamera(optionsForCamera,(data)=>console.log(data.assets))
};
const launchGallery = () => {
  const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
    selectionLimit:0
  };
  // launchCamera(options,(data)=>console.log(data))
  launchImageLibrary(options,(data)=>{
    console.log(data.assets);
  })
};

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
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  const [message, onChangeMessage] = React.useState(null);
  const [attachment, setAttachment] = useState([]);
  const [localMsg, setlocalMsg] = useState([]);
  const FlatListRef = useRef(null);
  const scrollY = new Animated.Value(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [mentions, setMentions] = useState([]);
  const [mentionsArr, setMentionsArr] = useState([]);
  const {width} = useWindowDimensions();
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
      console.log("api called");
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
    setActiveChannelTeamIdAction(teamId);
  }, [networkState?.isInternetConnected,teamId]);

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
          <MaterialIcons name="account-circle" size={20} />
          <Text key={index} style={{fontSize: 16, margin: 4, color: 'black'}}>
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
      (
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
      )
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
        <View style={{flex: 1,marginLeft:10}}>
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
          <View style={{margin: 8,marginLeft:0}}>
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
                  <MaterialIcons
                    name="attach-file"
                    size={20}
                    style={styles.attachIcon}
                    onPress={() =>
                      pickDocument(setAttachment, userInfoState?.accessToken)
                    }
                  />
                    <MaterialIcons
                    name="camera"
                    size={20}
                    style={styles.attachIcon}
                    onPress={launchCameraForPhoto}
                  />
                        <MaterialIcons
                    name="add"
                    size={20}
                    style={styles.attachIcon}
                    onPress={launchGallery}
                  />
                  <TextInput
                    editable
                    multiline
                    onChangeText={handleInputChange}
                    // onChangeText={text => onChangeMessage(text)}
                    value={message}
                    style={[
                      replyOnMessage
                        ? styles.inputWithReply
                        : styles.inputWithoutReply,
                      {color: 'black'},
                    ]}
                  />
                </View>
              </View>
              <View style={{justifyContent: 'flex-end'}}>
                <MaterialIcons
                  name="send"
                  size={25}
                  style={{color: 'black', padding: 10}}
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
                        }),
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
const styles = StyleSheet.create({
  mainContainer: {flex: 1, backgroundColor: 'white'},
  text: {
    color: 'black',
  },
  inputWithReply: {
    flex: 1,
    padding: 10,
  },
  inputWithoutReply: {
    flex: 1,
    // minHeight: 40,
    // paddingHorizontal: 10,
    // borderWidth: 1,
    // borderRadius: 10,
    // borderColor: 'grey',
    paddingVertical: 8,
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
  moveToBottom: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: '#cccccc',
    padding: 15,
    borderRadius: 25,
    color: 'black',
    fontSize: 19,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,

    elevation: 17,
  },
  container: {
    // borderWidth: 1,
    // borderColor: 'gray',
    // borderRadius: 10,
    // flexDirection: 'row',
    // alignItems: 'flex-end',
    // marginBottom: 15,
    // maxWidth: '90%',
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#b3b3b3',
    paddingHorizontal: 5,
    paddingVertical: 4,
  },
  attachIcon: {
    marginRight: 8,
    color: 'black',
    backgroundColor: '#cccccc',
    padding: 8,
    borderRadius: 25,
  },
});

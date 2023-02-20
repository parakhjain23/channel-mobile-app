import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import ListFooterComponent from '../../components/ListFooterComponent';
import {setActiveChannelTeamId} from '../../redux/actions/channels/SetActiveChannelId';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';
import {deleteMessageStart} from '../../redux/actions/chat/DeleteChatAction';
import {ChatCardMemo, LocalChatCardMemo} from './ChatCard';

const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction,
  channelsState,
  setActiveChannelTeamIdAction,
}) => {
  var {teamId, reciverUserId} = route.params;
  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  const [message, onChangeMessage] = React.useState(null);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  const [localMsg, setlocalMsg] = useState([]);
  useEffect(() => {
    setActiveChannelTeamIdAction(teamId);
  }, []);

  const memoizedData = useMemo(
    () => chatState?.data[teamId]?.messages || [],
    [chatState?.data[teamId]?.messages],
  );
  useEffect(() => {
    localMsg?.shift();
  }, [chatState?.data[teamId]?.messages]);
  const skip =
    chatState?.data[teamId]?.messages.length != undefined
      ? chatState?.data[teamId]?.messages.length
      : 0;
  useEffect(() => {
    if (
      chatState?.data[teamId]?.messages == undefined ||
      chatState?.data[teamId]?.messages == [] ||
      !chatState?.data[teamId]?.apiCalled
    ) {
      fetchChatsOfTeamAction(teamId, userInfoState?.accessToken);
    }
  }, []);
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
    <View style={{flex:1}}>
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={70}
      style={{flex: 1}}
      >
      <View style={{flex: 1}}>
        <View style={{flex: 9}}>
          {chatState?.data[teamId]?.isloading == true || teamId == undefined ? (
            <ActivityIndicator />
          ) : (
            <>
              <FlatList
                data={memoizedData}
                renderItem={renderItem}
                inverted
                ListFooterComponent={
                  chatState?.data[teamId]?.messages?.length > 15 &&
                  ListFooterComponent
                }
                onEndReached={
                  chatState?.data[teamId]?.messages?.length > 20 && onEndReached
                }
                onEndReachedThreshold={0.2}
                keyboardDismissMode="on-drag"
                keyboardShouldPersistTaps="always"
              />
              {localMsg?.length > 0 && (
                <FlatList data={localMsg} renderItem={renderItemLocal} />
              )}
            </>
          )}
        </View>

        <View style={{margin: 10}}>
          <View style={{flexDirection: 'row'}}>
            <View
              style={[
                replyOnMessage && styles.inputWithReplyContainer,
                {width: '90%'},
              ]}>
              {replyOnMessage && (
                <TouchableOpacity onPress={() => setreplyOnMessage(false)}>
                  <View style={styles.replyMessageInInput}>
                    <Text style={styles.text}>
                      {repliedMsgDetails?.content}
                    </Text>
                    <MaterialIcons name="cancel" size={16} />
                  </View>
                </TouchableOpacity>
              )}
              <TextInput
                editable
                multiline
                onChangeText={text => onChangeMessage(text)}
                value={message}
                style={[
                  replyOnMessage
                    ? styles.inputWithReply
                    : styles.inputWithoutReply,
                ]}
              />
            </View>
            <View style={{justifyContent: 'flex-end'}}>
              <MaterialIcons
                name="send"
                size={25}
                style={{color: 'black', padding: 10}}
                onPress={() => {
                  onChangeMessage(''),
                    setlocalMsg([
                      ...localMsg,
                      {
                        _id: '70356973726265363273736f',
                        appId: '62b53b61b5b4a2001fb9af37',
                        content: message,
                        createdAt: date,
                        isLink: false,
                        mentions: [],
                        orgId: orgState?.currentOrgId,
                        parentId: repliedMsgDetails?._id,
                        requestId: '73d31f2e-9039-401c-83cd-909953c264f1',
                        senderId: userInfoState?.user?.id,
                        senderType: 'APP',
                        showInMainConversation: true,
                        teamId: '63e09e1f0916f000183a9d87',
                        updatedAt: date,
                      },
                    ]),
                    sendMessageAction(
                      message.trim(),
                      teamId,
                      orgState?.currentOrgId,
                      userInfoState?.user?.id,
                      userInfoState?.accessToken,
                      repliedMsgDetails?._id || null,
                    );
                  // onChangeMessage('');
                  replyOnMessage && setreplyOnMessage(false);
                  repliedMsgDetails && setrepliedMsgDetails(null);
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
  userInfoState: state.userInfoReducer,
  orgState: state.orgsReducer,
  chatState: state.chatReducer,
  channelsState: state.channelsReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    fetchChatsOfTeamAction: (teamId, token, skip) =>
      dispatch(getChatsStart(teamId, token, skip)),
    sendMessageAction: (message, teamId, orgId, senderId, token, parentId) =>
      dispatch(
        sendMessageStart(message, teamId, orgId, senderId, token, parentId),
      ),
    deleteMessageAction: (accessToken, msgId) =>
      dispatch(deleteMessageStart(accessToken, msgId)),
    setActiveChannelTeamIdAction: teamId =>
      dispatch(setActiveChannelTeamId(teamId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);
const styles = StyleSheet.create({
  text: {
    color: 'black',
  },
  inputWithReply: {
    padding: 10,
  },
  inputWithoutReply: {
    minHeight: 40,
    paddingHorizontal: 10,
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
});

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import ListFooterComponent from '../../components/ListFooterComponent';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';
import {deleteMessageStart} from '../../redux/actions/chat/DeleteChatAction';
import ChatCard from './ChatCard';

const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction,
  channelsState,
}) => {
  var {teamId, reciverUserId} = route.params;
  if (teamId == undefined) {
    teamId = channelsState?.userIdAndTeamIdMapping[reciverUserId];
  }
  const [message, onChangeMessage] = React.useState(null);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
  const [localMessage, setLocalMessage] = useState([]);
  console.log(localMessage,'=-=-=-=-');
  const data = chatState?.data[teamId]?.messages
    ? [...localMessage, ...chatState?.data[teamId]?.messages]
    : [...localMessage, ...[]];
  useEffect(() => {
    setLocalMessage([]);
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
      console.log(index),
      (
        <ChatCard
          chat={item}
          userInfoState={userInfoState}
          orgState={orgState}
          deleteMessageAction={deleteMessageAction}
          chatState={chatState}
          setreplyOnMessage={setreplyOnMessage}
          setrepliedMsgDetails={setrepliedMsgDetails}
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
  const onEndReached = useCallback(() => {
    fetchChatsOfTeamAction(teamId, userInfoState?.accessToken, skip);
  }, [teamId, userInfoState, skip, fetchChatsOfTeamAction]);
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        {teamId == undefined ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={data}
            renderItem={renderItem}
            inverted
            ListFooterComponent={
              chatState?.data[teamId]?.messages?.length > 15 &&
              ListFooterComponent
            }
            onEndReached={onEndReached}
            onEndReachedThreshold={0.2}
          />
        )}
      </View>
      <View style={{margin: 10, justifyContent: 'center'}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={[
              replyOnMessage && styles.inputWithReplyContainer,
              {width: '90%'},
            ]}>
            {replyOnMessage && (
              <TouchableOpacity onPress={() => setreplyOnMessage(false)}>
                <View style={styles.replyMessageInInput}>
                  <Text style={styles.text}>{repliedMsgDetails?.content}</Text>
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
              onSubmitEditing={() => onChangeMessage('')}
            />
          </View>
          <View style={{justifyContent: 'center', margin: 10}}>
            <MaterialIcons
              name="send"
              size={20}
              onPress={() => {
                setLocalMessage([
                  {
                    _id: '74636676346c776d66616734',
                    content: message,
                    createdAt: '2023-02-06T07:23:08.299Z',
                    deleted: false,
                    isActivity: false,
                    isLink: false,
                    isParent: false,
                    orgId: orgState?.currentOrgId,
                    parentId: null,
                    senderId: 'Qn09wauelBpsFNdO',
                    senderType: 'USER',
                    teamId: teamId,
                  },
                  ...localMessage,
                ]),
                  sendMessageAction(
                    message.trim(),
                    teamId,
                    orgState?.currentOrgId,
                    userInfoState?.user?.id,
                    userInfoState?.accessToken,
                    repliedMsgDetails?._id || null,
                  );
                onChangeMessage('');
                setreplyOnMessage(false);
                setrepliedMsgDetails(null);
              }}
            />
          </View>
        </View>
      </View>
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
    padding: 20,
    alignItems: 'center',
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

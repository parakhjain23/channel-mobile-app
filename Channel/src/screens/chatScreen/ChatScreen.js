import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {GestureHandlerRootView, Swipeable} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {connect} from 'react-redux';
import {
  getChatsStart,
  sendMessageStart,
} from '../../redux/actions/chat/ChatActions';
import {deleteMessageStart} from '../../redux/actions/chat/DeleteChatAction';

const AddRemoveJoinedMsg = ({senderName, content, orgState}) => {
  const id = content.split(' ').pop().slice(2, -2);
  const name = orgState?.userIdAndNameMapping[id];
  const activityName = content.split(' ')[0];
  const textToShow =
    content == 'joined this channel'
      ? senderName + ' ' + content
      : senderName + ' ' + activityName + ' ' + name;
  return (
    <View style={[styles.actionText]}>
      <Text style={styles.text}>{textToShow}</Text>
    </View>
  );
};

const ChatCard = ({
  chat,
  userInfoState,
  orgState,
  deleteMessageAction,
  chatState,
  setreplyOnMessage,
  setrepliedMsgDetails,
  image = 'https://t4.ftcdn.net/jpg/05/11/55/91/360_F_511559113_UTxNAE1EP40z1qZ8hIzGNrB0LwqwjruK.jpg',
}) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const swipeableRef = useRef(null);
  const onLongPress = () => {
    setOptionsVisible(true);
  };
  const parentId = chat?.parentId;
  const date = new Date(chat?.updatedAt);
  const time = date.getHours() + ':' + date.getMinutes();
  const sentByMe = chat?.senderId == userInfoState?.user?.id;
  const SenderName =
    chat?.senderId == userInfoState?.user?.id
      ? 'You'
      : orgState?.userIdAndNameMapping[chat?.senderId];
  const swipeFromLeftOpen = () => {
    setrepliedMsgDetails(chat);
    setreplyOnMessage(true);
    swipeableRef?.current?.close();
  };
  const LeftSwipeActions = () => {
    return (
      <View style={{width: '10%', justifyContent: 'center', zIndex: 0}}>
        <Icon name="reply" size={20} />
      </View>
    );
  };
  return (
    <>
      {!chat?.isActivity ? (
        <TouchableOpacity onLongPress={sentByMe ? onLongPress : null}>
          <GestureHandlerRootView>
            <Swipeable
              ref={swipeableRef}
              renderLeftActions={LeftSwipeActions}
              onSwipeableLeftOpen={swipeFromLeftOpen}>
              <View
                style={[
                  styles.container,
                  sentByMe ? styles.sentByMe : styles.received,
                ]}>
                {sentByMe ? null : (
                  <Image source={{uri: image}} style={styles.avatar} />
                )}
                <View style={styles.textContainer}>
                  <View style={{flexDirection: 'row',alignItems:'center'}}>
                    <Text style={[styles.nameText, styles.text]}>
                      {SenderName}
                    </Text>
                    <Text style={[styles.timeText, styles.text,{marginHorizontal:10}]}>{time}</Text>
                  </View>
                  {parentId != null && (
                    <View style={styles.repliedContainer}>
                      <Text style={styles.text}>
                        {
                          chatState?.data[chat.teamId]?.parentMessages[parentId]
                            ?.content
                        }
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.messageText, styles.text]}>
                    {chat?.content}
                  </Text>
                </View>
                {/* <Text style={[styles.timeText, styles.text]}>{time}</Text> */}
                {sentByMe ? (
                  <Image source={{uri: image}} style={styles.avatar} />
                ) : null}
              </View>
              <View style={sentByMe ? styles.sentByMe : styles.received}>
                {optionsVisible && (
                  <TouchableOpacity
                    onPress={() => {
                      setOptionsVisible(false),
                        deleteMessageAction(
                          userInfoState?.accessToken,
                          chat?._id,
                        );
                    }}>
                    <Text style={styles.text}>Delete</Text>
                  </TouchableOpacity>
                )}
              </View>
            </Swipeable>
          </GestureHandlerRootView>
        </TouchableOpacity>
      ) : (
        <AddRemoveJoinedMsg
          senderName={SenderName}
          content={chat?.content}
          orgState={orgState}
        />
      )}
    </>
  );
};
const ListFooterComponent = () => {
  const [animate, setAnimate] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setAnimate(false);
    }, 1000);
  });
  return <ActivityIndicator animating={animate} size={'small'} />;
};
const ChatScreen = ({
  route,
  userInfoState,
  fetchChatsOfTeamAction,
  sendMessageAction,
  chatState,
  orgState,
  deleteMessageAction,
}) => {
  const {teamId} = route.params;
  const [message, onChangeMessage] = React.useState(null);
  const [replyOnMessage, setreplyOnMessage] = useState(false);
  const [repliedMsgDetails, setrepliedMsgDetails] = useState('');
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
  return (
    <View style={{flex: 1}}>
      <View style={{flex: 7}}>
        {/* {chatState?.data[teamId]?.isloading ? (
          <ActivityIndicator />
        ) : ( */}
        <FlatList
          data={chatState?.data[teamId]?.messages || []}
          renderItem={({item}) => (
            <ChatCard
              chat={item}
              userInfoState={userInfoState}
              orgState={orgState}
              deleteMessageAction={deleteMessageAction}
              chatState={chatState}
              setreplyOnMessage={setreplyOnMessage}
              setrepliedMsgDetails={setrepliedMsgDetails}
            />
          )}
          inverted
          ListFooterComponent={
            chatState?.data[teamId]?.messages?.length > 15 &&
            ListFooterComponent
          }
          onEndReached={() => {
            fetchChatsOfTeamAction(teamId, userInfoState?.accessToken, skip);
          }}
          onEndReachedThreshold={0.2}
          // contentContainerStyle={{ flexDirection: 'column-reverse' }}
        />
        {/* )} */}
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

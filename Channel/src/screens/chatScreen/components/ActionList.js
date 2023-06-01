import React from 'react';
import {Text, TouchableOpacity, Vibration, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ms, s} from 'react-native-size-matters';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../ChatCardStyles';
import Clipboard from '@react-native-community/clipboard';
import {connect} from 'react-redux';
import {deleteMessageStart} from '../../../redux/actions/chat/DeleteChatAction';

const ActionList = ({
  sentByMe,
  chat,
  setreplyOnMessage,
  setrepliedMsgDetails,
  setShowActions,
  deleteMessageAction,
  userInfoState,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const copyToClipboard = text => {
    Clipboard.setString(text);
    setShowActions(false);
  };
  const swipeFromLeftOpen = () => {
    Vibration.vibrate(30);
    setrepliedMsgDetails(chat);
    setreplyOnMessage(true);
    setShowActions(false);
  };
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
          //   setOptionsVisible(false),
          copyToClipboard(chat?.content);
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
          //   setOptionsVisible(false),
          swipeFromLeftOpen();
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
            deleteMessageAction(userInfoState?.accessToken, chat?._id);
            setShowActions(false);
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
const mapStateToProps = state => ({
  userInfoState: state.userInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    deleteMessageAction: (accessToken, msgId) =>
      dispatch(deleteMessageStart(accessToken, msgId)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ActionList);

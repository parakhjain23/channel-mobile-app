import {StyleSheet} from 'react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';
export const makeStyles = colors =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      backgroundColor: colors?.primaryColor,
    },
    mainContainer: {
      flex: 1,
      backgroundColor: colors.primaryColor,
      paddingHorizontal: 0,
    },
    outerContainer: {flex: 1, marginLeft: 10, marginRight: 10},
    messageListContainer: {
      flex: 9,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    animatedLottieView: {
      height: ms(100),
      width: ms(100),
    },
    attachmentLoading: {height: 100, alignSelf: 'center'},
    text: {
      color: colors.textColor,
    },
    repliedText: {
      color: 'black',
    },
    inputWithReply: {
      flex: 1,
      padding: 10,
    },
    inputWithoutReply: {
      flex: 1,
      paddingVertical: 8,
      marginLeft: 5,
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
      paddingRight: 14,
      borderWidth: 0.3,
      borderLeftColor: '#b38b6d',
      borderLeftWidth: 4,
      borderRadius: 5,
      padding: 5,
      backgroundColor: '#d9d9d9',
      maxHeight: 80,
      minHeight: 25,
      overflow: 'hidden',
    },
    playerContainer: {
      flexDirection: 'row',
      // justifyContent: 'space-between',
      marginTop: 0,
      width: '100%',
      // borderWidth: 0.7,
      // borderColor: colors?.color,
      // borderRadius: ms(5),
      // paddingTop: ms(15),
      backgroundColor: colors?.primaryColor,
      // flex: 1,
      // height:80,
      maxHeight: 200,
      // minHeight: ms(80),
      // overflow: 'hidden',
    },
    repliedContainer: {
      padding: 5,
      backgroundColor: '#d9d9d9',
      borderRadius: 5,
      marginBottom: 4,
    },
    mentionsList: {maxHeight: 250},
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
    bottomContainer: {
      marginBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
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
      fontSize: 16,
    },
    timeText: {
      color: '#666',
      marginRight: 3,
      marginBottom: 4,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderTopWidth: 1,
      borderRadius: 4,
      borderColor: '#b3b3b3',
      // paddingHorizontal: 5,
      // paddingVertical: 4,
      maxHeight: 200,
    },
  });

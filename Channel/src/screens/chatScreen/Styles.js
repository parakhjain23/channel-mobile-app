import {StyleSheet} from 'react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';
export const makeStyles = colors =>
  StyleSheet.create({
    safeAreaView: {flex: 1, backgroundColor: colors.primaryColor},
    mainContainer: {
      flex: 1,
      backgroundColor: colors.primaryColor,
      paddingHorizontal: 5,
    },
    outerContainer: {flex: 1, marginLeft: ms(10)},
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
    attachmentLoading: {height: s(100), alignSelf: 'center'},
    text: {
      color: colors.textColor,
    },
    repliedText: {
      color: 'black',
    },
    inputWithReply: {
      flex: 1,
      padding: ms(10),
    },
    inputWithoutReply: {
      flex: 1,
      paddingVertical: mvs(8),
    },
    inputWithReplyContainer: {
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: ms(10),
    },
    replyMessageInInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: ms(5),
      paddingRight: ms(14),
      borderWidth: ms(0.3),
      borderLeftColor: '#b38b6d',
      borderLeftWidth: 4,
      borderRadius: ms(5),
      padding: ms(5),
      backgroundColor: '#d9d9d9',
      maxHeight: ms(80),
      minHeight: ms(25),
      overflow: 'hidden',
    },
    repliedContainer: {
      padding: ms(5),
      backgroundColor: '#d9d9d9',
      borderRadius: ms(5),
      marginBottom: ms(4),
    },
    mentionsList: {maxHeight: mvs(140)},
    option: {
      margin: ms(8),
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
      borderRadius: ms(25),
      color: 'black',
      fontSize: ms(19),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.46,
      shadowRadius: 11.14,

      elevation: ms(17),
    },
    bottomContainer: {
      marginBottom: ms(10),
      marginLeft: 0,
      flexDirection: 'row',
    },
    sentByMe: {
      alignSelf: 'flex-end',
      marginRight: ms(10),
    },
    received: {
      alignSelf: 'flex-start',
      marginLeft: ms(10),
    },
    avatar: {
      width: ms(32),
      height: mvs(32),
      borderRadius: ms(16),
      marginHorizontal: ms(4),
    },
    textContainer: {
      padding: ms(8),
      borderRadius: ms(8),
      flexDirection: 'column',
      maxWidth: '70%',
    },
    nameText: {
      fontWeight: 'bold',
      fontSize: ms(12),
      marginBottom: mvs(4),
    },
    messageText: {
      fontSize: ms(14),
    },
    timeText: {
      color: '#666',
      marginRight: ms(3),
      marginBottom: mvs(4),
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: ms(1),
      borderRadius: ms(4),
      borderColor: '#b3b3b3',
      paddingHorizontal: ms(5),
      paddingVertical: mvs(4),
      maxHeight: mvs(200),
    },
    attachIcon: {
      marginRight: ms(8),
      color: 'black',
      backgroundColor: '#cccccc',
      padding: ms(8),
      borderRadius: ms(25),
    },
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: ms(10),
    },
  });

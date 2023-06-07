import {StyleSheet} from 'react-native';
import {s, vs, ms, mvs} from 'react-native-size-matters';

export const makeStyles = colors =>
  StyleSheet.create({
    text: {
      color: colors.color,
    },
    optionsText: {
      fontSize: 16,
      color: 'black',
    },
    inputWithReply: {
      padding: ms(10),
    },
    inputWithoutReply: {
      padding: ms(20),
      alignItems: 'center',
      borderWidth: ms(1),
      borderRadius: ms(10),
      borderColor: 'grey',
    },
    inputWithReplyContainer: {
      borderWidth: ms(1),
      borderColor: 'gray',
      borderRadius: ms(10),
    },
    replyMessageInInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: ms(5),
      borderWidth: ms(0.25),
      borderRadius: ms(5),
      padding: ms(5),
      backgroundColor: '#d9d9d9',
    },
    repliedContainer: {
      padding: ms(5),
      backgroundColor: '#F5F5F5',
      borderRadius: ms(3),
      marginBottom: mvs(4),
      borderWidth: s(0.3),
      maxHeight: ms(80),
      borderLeftColor: '#b38b6d',
      borderLeftWidth: ms(4),
      flexDirection: 'row',
      overflow: 'hidden',
    },
    option: {
      margin: ms(8),
      backgroundColor: 'yellow',
    },
    actionText: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: mvs(10),
    },
    container: {
      borderRadius: ms(5),
      maxWidth: '90%',
    },
    sentByMe: {
      alignSelf: 'flex-end',
      borderColor: 'transparent',
    },
    received: {
      alignSelf: 'flex-start',
      marginLeft: 0,
      borderColor: 'gray',
    },
    avatar: {
      width: ms(32),
      height: mvs(32),
      borderRadius: ms(16),
      marginHorizontal: ms(4),
    },
    textContainer: {
      padding: 6,
      // maxWidth: '90%',
    },
    nameText: {
      fontWeight: '600',
      fontSize: 16,
      marginBottom: 2,
    },
    messageText: {
      fontSize: 16,
    },
    timeText: {
      fontSize: 11,
      // marginLeft: ms(5),
      // marginRight: ms(-3),
      // marginBottom: ms(-4),
    },
  });

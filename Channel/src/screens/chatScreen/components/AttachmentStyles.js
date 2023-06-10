import {StyleSheet} from 'react-native';
export const listStyles = colors =>
  StyleSheet.create({
    attachmentTile: {
      flexDirection: 'row',
      // backgroundColor: colors?.primaryColor,
      alignItems: 'center',
      marginBottom: 5,
      borderRadius: 5,
      padding: 2,
      borderWidth: 0.5,
      borderColor: 'gray',
    },
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 3,
    },
    attachIcon: {
      // marginRight: 5,
      color: colors?.color,
      // backgroundColor: colors?.primaryColor,
      padding: 8,
      // borderRadius: 25,
    },
    text: {
      color: colors?.color,
    },
  });

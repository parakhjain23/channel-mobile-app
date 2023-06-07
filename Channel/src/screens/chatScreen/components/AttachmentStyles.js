import {StyleSheet} from 'react-native';
export const listStyles = colors =>
  StyleSheet.create({
    attachmentTile: {
      flexDirection: 'row',
      backgroundColor: '#cccccc',
      alignItems: 'center',
      marginBottom: 5,
      borderRadius: 5,
    },
    optionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 3,
    },
    attachIcon: {
      marginRight: 8,
      color: 'black',
      backgroundColor: '#cccccc',
      padding: 8,
      borderRadius: 25,
    },
  });

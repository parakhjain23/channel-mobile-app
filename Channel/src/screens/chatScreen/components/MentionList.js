import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../Styles';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const MentionList = ({data, setMentionsArr, onChangeMessage, setMentions}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const handleMentionSelect = mention => {
    const userId = mention?._source?.userId;
    const displayName = mention?._source?.displayName;

    setMentionsArr(prevUserIds => [
      ...prevUserIds,
      userId !== undefined ? userId : '@all',
    ]);
    onChangeMessage(prevMessage => {
      const regex = new RegExp(`@\\w*\\s?$`);
      const replacement = `@${displayName} `;
      return prevMessage.replace(regex, replacement);
    });
    setMentions([]);
  };

  const renderMention = useMemo(
    () =>
      ({item, index}) => {
        if (item?._source?.type !== 'U') {
          return null;
        }
        const handlePress = () => handleMentionSelect(item);
        return (
          <TouchableOpacity
            onPress={handlePress}
            key={index}
            style={{borderRadius: 6, margin: 1, padding: 2}}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 0.8,
                borderColor: 'grey',
                borderRadius: 6,
                padding: 6,
                backgroundColor: colors?.primaryColor,
              }}>
              <MaterialIcons
                name="account-circle"
                size={20}
                color={colors.sentByMeCardColor}
                style={{marginRight: 8}}
              />
              <Text style={{fontSize: 16, color: colors?.textColor}}>
                {item?._source?.displayName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      },
    [handleMentionSelect],
  );
  return (
    <FlatList
      data={data}
      renderItem={renderMention}
      style={styles.mentionsList}
      keyboardShouldPersistTaps="always"
    />
  );
};

export default MentionList;

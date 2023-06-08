import {View, Text} from 'react-native';
import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {makeStyles} from '../Styles';
import {TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import FastImage from 'react-native-fast-image';

const MentionList = ({
  data,
  setMentionsArr,
  onChangeMessage,
  setMentions,
  orgsState,
}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const handleMentionSelect = mention => {
    const userId = mention?._source?.userId;
    const displayName = mention?._source?.displayName;
    const teamId = mention?._source?.id;
    const title = mention?._source?.title;
    const type = mention?._source?.type;

    setMentionsArr(prevUserIds => [
      ...prevUserIds,
      {
        type: type,
        userId: userId !== undefined ? userId : '@all',
        teamId: type === 'T' ? teamId : null,
      },
    ]);
    onChangeMessage(prevMessage => {
      const regex = new RegExp(`@\\w*\\s?$`);
      const replacement = type === 'U' ? `@${displayName} ` : `@${title} `;
      const replacedText = replacement.replace(/\s(?=\S)/g, '_');
      return prevMessage.replace(regex, replacedText);
    });
    setMentions([]);
  };

  const renderMention = useMemo(
    () =>
      ({item, index}) => {
        const Type = item?._source?.type;
        if (item?._source?.status?.toLowerCase() === 'invited') {
          return null;
        }
        const handlePress = () => handleMentionSelect(item);
        return (
          <TouchableOpacity
            onPress={handlePress}
            key={index}
            style={{borderRadius: 6, padding: 1}}>
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
              {Type?.toUpperCase() === 'U' ? (
                orgsState?.userIdAndImageUrlMapping[item?._source?.userId] ? (
                  <FastImage
                    source={{
                      uri: orgsState?.userIdAndImageUrlMapping[
                        item?._source?.userId
                      ],
                    }}
                    style={{
                      height: 20,
                      width: 20,
                      borderRadius: 50,
                      marginRight: 8,
                    }}
                  />
                ) : (
                  <MaterialIcons
                    name="account-circle"
                    size={20}
                    color={colors.sentByMeCardColor}
                    style={{marginRight: 8}}
                  />
                )
              ) : (
                <Feather
                  name="hash"
                  size={20}
                  color={colors.sentByMeCardColor}
                  style={{marginRight: 8}}
                />
              )}

              <Text style={{fontSize: 16, color: colors?.textColor}}>
                {Type?.toUpperCase() === 'U'
                  ? item?._source?.displayName
                  : item?._source?.title}
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

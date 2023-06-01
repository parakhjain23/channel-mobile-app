import {View, Text, TouchableOpacity} from 'react-native';
import React, {useMemo} from 'react';
import {FlatList} from 'react-native';
import {ACTIVITIES} from '../../../constants/Constants';
import {makeStyles} from '../Styles';
import {useTheme} from '@react-navigation/native';
import {Image} from 'react-native';

const ActivityList = ({setaction, onChangeMessage, setActivities}) => {
  const {colors} = useTheme();
  const styles = makeStyles(colors);

  const handleActionSelect = action => {
    setaction(action);
    onChangeMessage(prevMessage => {
      const regex = new RegExp(`/\\w*\\s?$`);
      const replacement = `/${action} `;
      return prevMessage.replace(regex, replacement);
    });
    setActivities(false);
  };

  const renderActions = useMemo(
    () =>
      ({item, index}) =>
        (
          <TouchableOpacity
            onPress={() => handleActionSelect(item?.name)}
            key={index}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 0.7,
                borderTopColor: 'grey',
                borderRadius: 10,
                margin: 2,
                padding: 2,
              }}>
              <Image
                source={require('../../../assests/images/appIcon/icon48size.png')}
                style={{height: 30, width: 30, marginRight: 4}}
              />
              <View>
                <Text
                  style={{fontSize: 16, margin: 4, color: colors.textColor}}>
                  {item?.name}
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginLeft: 4,
                    color: colors.textColor,
                  }}>
                  {item?.desc}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ),
    [handleActionSelect],
  );
  return (
    <FlatList
      data={ACTIVITIES}
      renderItem={renderActions}
      style={styles.mentionsList}
      keyboardShouldPersistTaps="always"
    />
  );
};

export default ActivityList;

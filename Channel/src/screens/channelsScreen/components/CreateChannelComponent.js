import {useTheme} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {RenderUsersToAdd} from '../ChannelCard';
import {Button} from 'react-native';
import {CHANNEL_TYPE} from '../../../constants/Constants';
import {TouchableOpacity} from 'react-native';
import {RadioButton, TextInput} from 'react-native-paper';
const CreateChannelModelComponent = ({modalizeRef, props}) => {
  const {colors} = useTheme();
  const [title, setTitle] = useState('');
  const [channelType, setChannelType] = useState('PUBLIC');
  const [userIds, setUserIds] = useState([]);
  const [searchedUser, setsearchedUser] = useState('');
  useEffect(() => {
    if (searchedUser != '') {
      props.getChannelsByQueryStartAction(
        searchedUser,
        props?.userInfoState?.user?.id,
        props?.orgsState?.currentOrgId,
      );
    }
  }, [searchedUser]);

  const changeText = value => {
    setsearchedUser(value);
  };
  return (
    <Modalize
      scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
      ref={modalizeRef}
      onClose={() => setsearchedUser('')}
      modalStyle={{
        flex: 1,
        marginTop: '20%',
        backgroundColor: colors.modalColor,
      }}>
      <View style={{margin: 12, flex: 1}}>
        <TextInput
          label={'Title'}
          mode={'outlined'}
          onChangeText={setTitle}
          autoFocus={true}
          textColor={colors.textColor}
          activeOutlineColor={colors.textColor}
          style={{backgroundColor: colors.primaryColor}}
        />
        <TextInput
          label={'Members'}
          mode={'outlined'}
          value={searchedUser}
          onChangeText={changeText}
          textColor={colors.textColor}
          activeOutlineColor={colors.textColor}
          style={{backgroundColor: colors.primaryColor}}
        />

        {searchedUser != '' && (
          <ScrollView
            style={{maxHeight: 200}}
            keyboardShouldPersistTaps="always">
            {props?.channelsByQueryState?.channels?.map((item, index) => {
              return (
                item?._source?.type == 'U' && (
                  <RenderUsersToAdd
                    key={item._source.userId}
                    item={item}
                    setUserIds={setUserIds}
                    userIds={userIds}
                    setsearchedUser={setsearchedUser}
                  />
                )
              );
            })}
          </ScrollView>
        )}
        {userIds.length != 0 &&
          userIds?.map((userId, index) => {
            return (
              <View
                key={index}
                style={{
                  marginVertical: 5,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <View
                  style={{
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '400',
                      color: colors.textColor,
                    }}>
                    {props?.orgsState?.userIdAndNameMapping[userId]}
                  </Text>
                </View>
                <Button
                  title="Remove"
                  onPress={() => {
                    var updatedUserIds = userIds.filter(id => id !== userId);
                    setUserIds(updatedUserIds);
                  }}
                />
              </View>
            );
          })}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginVertical: 20,
          }}>
          {CHANNEL_TYPE?.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => setChannelType(item?.type)}>
                <Text style={{color: colors.textColor}}>{item?.name}</Text>
                <RadioButton
                  value={item?.type}
                  status={channelType === item?.type ? 'checked' : 'unchecked'}
                  onPress={() => setChannelType(item?.type)}
                  color={colors.textColor}
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <Button
          disabled={title.trim() == '' ? true : false}
          title="Create Channel"
          onPress={() => {
            if (title === '') {
              Alert.alert('Please Enter the title');
            } else {
              props.createNewChannelAction(
                props?.userInfoState?.accessToken,
                props?.orgsState?.currentOrgId,
                title,
                channelType,
                userIds,
              );
              setUserIds([]);
              modalizeRef?.current?.close();
            }
          }}
        />
      </View>
    </Modalize>
  );
};

export const CreateChannelModal = React.memo(CreateChannelModelComponent);

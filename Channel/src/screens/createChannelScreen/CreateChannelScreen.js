import {
  View,
  Text,
  ScrollView,
  Button,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RadioButton, TextInput} from 'react-native-paper';
import {RenderUsersToAdd} from '../channelsScreen/ChannelCard';
import {useTheme} from '@react-navigation/native';
import {connect} from 'react-redux';
import {ms, mvs} from 'react-native-size-matters';
import {CHANNEL_TYPE} from '../../constants/Constants';
import {getChannelsByQueryStart} from '../../redux/actions/channels/ChannelsByQueryAction';
import {createNewChannelStart} from '../../redux/actions/channels/CreateNewChannelAction';

const CustomInputWithUserIds = ({
  userIds,
  setUserIds,
  searchedUser,
  changeText,
  orgsState,
  ...props
}) => {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.userIdsContainer}>
        {userIds.map((userId, index) => (
          <View key={index} style={styles.userId}>
            <Text style={styles.userIdText}>
              {orgsState.userIdAndNameMapping[userId]}
            </Text>
            <TouchableOpacity
              onPress={() => {
                var updatedUserIds = userIds.filter(id => id !== userId);
                setUserIds(updatedUserIds);
              }}
              style={styles.removeButton}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          mode={'flat'}
          value={searchedUser}
          onChangeText={changeText}
          textColor={colors.textColor}
          activeOutlineColor={colors.textColor}
          style={{...styles.input, backgroundColor: colors.primaryColor}}
          {...props}
        />
      </View>
    </View>
  );
};
const CreateChannelScreen = props => {
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
    <ScrollView keyboardShouldPersistTaps="always">
      <View style={{margin: ms(12), flex: 1}}>
        <TextInput
          label={'Title'}
          mode={'flat'}
          onChangeText={setTitle}
          autoFocus={true}
          textColor={colors.textColor}
          activeOutlineColor={colors.textColor}
          style={{backgroundColor: colors.primaryColor}}
        />
        <CustomInputWithUserIds
          userIds={userIds}
          setUserIds={setUserIds}
          searchedUser={searchedUser}
          changeText={changeText}
          orgsState={props.orgsState}
        />

        {/* <View>
          <TextInput
            label={'Members'}
            mode={'flat'}
            value={searchedUser}
            onChangeText={changeText}
            textColor={colors.textColor}
            activeOutlineColor={colors.textColor}
            style={{backgroundColor: colors.primaryColor}}
          />
          {userIds?.length != 0 &&
            userIds?.map((userId, index) => {
              return (
                <View
                  key={index}
                  style={{
                    marginVertical: mvs(5),
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  }}>
                  <View
                    style={{
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: ms(16, 0.5),
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
        </View> */}

        {searchedUser != '' && (
          <ScrollView style={{flex: 1}} keyboardShouldPersistTaps="always">
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

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            marginVertical: mvs(20),
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
    </ScrollView>
  );
};
const mapStateToProps = state => ({
  orgsState: state.orgsReducer,
  channelsByQueryState: state.channelsByQueryReducer,
  userInfoState: state.userInfoReducer,
});
const mapDispatchToProps = dispatch => {
  return {
    getChannelsByQueryStartAction: (query, userToken, orgId) =>
      dispatch(getChannelsByQueryStart(query, userToken, orgId)),
    createNewChannelAction: (token, orgId, title, channelType, userIds) =>
      dispatch(
        createNewChannelStart(token, orgId, title, channelType, userIds),
      ),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateChannelScreen);

const styles =
  StyleSheet.create({
    container: {
      marginBottom: 10,
    },
    userIdsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    userId: {
      flexDirection: 'row',
      alignItems: 'center',
    //   backgroundColor: colors.tagBackground,
      borderRadius: 20,
      paddingHorizontal: 8,
      paddingVertical: 4,
      marginRight: 5,
      marginBottom: 5,
    },
    userIdText: {
      fontSize: ms(14, 0.5),
      fontWeight: '400',
    //   color: colors.tagText,
    },
    removeButton: {
      marginLeft: 4,
    },
    removeButtonText: {
    //   color: colors.tagText,
      fontSize: ms(14, 0.5),
    },
    input: {
      flex: 1,
      minWidth: 80,
      paddingHorizontal: 0,
      paddingVertical: 0,
      marginTop: 5,
      marginBottom: 5,
    },
  });

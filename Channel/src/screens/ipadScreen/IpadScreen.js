import {View} from 'react-native';
import React, {useState} from 'react';
import ChannelsScreen from '../channelsScreen/ChannelsScreen';
import ChatScreen from '../chatScreen/ChatScreen';
import AppProvider from '../appProvider/AppProvider';
import {DEVICE_TYPES} from '../../constants/Constants';
import {useTheme} from '@react-navigation/native';

const IpadScreen = () => {
  const {colors} = useTheme();
  const [chatDetailsForTab, setChatDetailsForTab] = useState({teamId: 'demo'});
  return (
    <AppProvider>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.primaryColor,
        }}>
        <View style={{flex: 1}}>
          <ChannelsScreen
            setChatDetailsForTab={setChatDetailsForTab}
            deviceType={DEVICE_TYPES[1]}
          />
        </View>
        <View style={{flex: 2}}>
          {/* {chatDetailsForTab?.teamId!='demo' && <ChatHeaderForTab chatDetailsForTab={chatDetailsForTab} setChatDetailsForTab={setChatDetailsForTab} />} */}
          <ChatScreen
            deviceType={DEVICE_TYPES[1]}
            headerTitle={'Channel'}
            chatDetailsForTab={chatDetailsForTab}
            setChatDetailsForTab={setChatDetailsForTab}
          />
        </View>
      </View>
    </AppProvider>
  );
};

export default IpadScreen;

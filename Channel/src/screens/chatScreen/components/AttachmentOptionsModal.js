import {View, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Modalize} from 'react-native-modalize';
import AttachmentOptions from './AttachmentOptions';
import {useTheme} from '@react-navigation/native';
import {listStyles} from './AttachmentStyles';

const AttachmentOptionsModal = ({AttachmentObject}) => {
  const {modalizeRef} = AttachmentObject;
  const {colors} = useTheme();
  const listStyle = listStyles(colors);
  const HeaderComponent = () => {
    return (
      <View style={{paddingBottom: 15}}>
        <Text style={{textAlign: 'center', color: colors?.color, fontSize: 16}}>
          Attach a File
        </Text>
      </View>
    );
  };
  return (
    <Modalize
      ref={modalizeRef}
      scrollViewProps={{keyboardShouldPersistTaps: 'always'}}
      snapPoint={200}
      modalHeight={300}
      onBackButtonPress={() => modalizeRef?.current?.close()}
      closeOnOverlayTap={true}
      modalStyle={{
        backgroundColor: colors.modalColor,
      }}>
      <View style={{padding: 15, flex: 1}}>
        <HeaderComponent />
        <AttachmentOptions AttachmentObject={AttachmentObject} />
      </View>
    </Modalize>
  );
};

export default AttachmentOptionsModal;

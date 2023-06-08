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
      <View style={{marginTop: 10}}>
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
      modalStyle={{
        // flex: 1,
        backgroundColor: colors.modalColor,
      }}
      HeaderComponent={HeaderComponent}>
      <View style={{padding: 15}}>
        <AttachmentOptions AttachmentObject={AttachmentObject} />
      </View>
    </Modalize>
  );
};

export default AttachmentOptionsModal;

import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useRef, useState} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Animated} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {pickDocument} from '../DocumentPicker';
import {launchCameraForPhoto, launchGallery} from '../ImagePicker';
import {listStyles} from './AttachmentStyles';

const AttachmentTile = ({
  onPress,
  iconName,
  iconSize,
  tileText,
  listStyles,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={listStyles?.attachmentTile}
      activeOpacity={0.8}>
      <MaterialIcons
        name={iconName}
        size={iconSize}
        style={listStyles.attachIcon}
      />
      <Text>{tileText}</Text>
    </TouchableOpacity>
  );
};

const AttachmentOptions = ({
  accessToken,
  setAttachment,
  setAttachmentLoading,
  setShowOptions,
  optionsPosition,
}) => {
  const {colors} = useTheme();
  const listStyle = listStyles(colors);

  return (
    <View style={{justifyContent: 'center'}}>
      <Animated.View
        style={[
          listStyles.optionsContainer,
          {transform: [{translateX: optionsPosition}]},
        ]}>
        <View style={{borderRadius: 20}}>
          <AttachmentTile
            onPress={() => {
              pickDocument(setAttachment, accessToken, setAttachmentLoading);
              setShowOptions(false);
            }}
            iconName="attach-file"
            iconSize={20}
            tileText="Attach Pdf, docs from Your Device"
            listStyles={listStyle}
          />
          <AttachmentTile
            onPress={() => {
              launchCameraForPhoto(
                accessToken,
                setAttachment,
                setAttachmentLoading,
              );
              setShowOptions(false);
            }}
            iconName="camera"
            iconSize={20}
            tileText="Upload from Camera"
            listStyles={listStyle}
          />
          <AttachmentTile
            onPress={() => {
              launchGallery(accessToken, setAttachment, setAttachmentLoading);
              setShowOptions(false);
            }}
            iconName="image"
            iconSize={20}
            tileText="Open Gallery"
            listStyles={listStyle}
          />
        </View>
      </Animated.View>
    </View>
  );
};

export default AttachmentOptions;

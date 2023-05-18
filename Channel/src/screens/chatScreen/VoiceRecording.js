import {View, Text, PermissionsAndroid, Button, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import AudioRecorderPlayer, {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  OutputFormatAndroidType,
} from 'react-native-audio-recorder-player';
import RNFetchBlob from 'rn-fetch-blob';

export const AudioRecorderPlay = new AudioRecorderPlayer();
const audioSet = {
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};
const path = Platform.select({
  ios: `sound.m4a`,
  android: `${RNFetchBlob.fs.dirs.CacheDir}/sound.mp3`,

  // Discussion: https://github.com/hyochan/react-native-audio-recorder-player/discussions/479
  // ios: 'https://firebasestorage.googleapis.com/v0/b/cooni-ebee8.appspot.com/o/test-audio.mp3?alt=media&token=d05a2150-2e52-4a2e-9c8c-d906450be20b',
  // ios: 'https://staging.media.ensembl.fr/original/uploads/26403543-c7d0-4d44-82c2-eb8364c614d0',
  // ios: 'hello.m4a',
  // android: `${this.dirs.CacheDir}/hello.mp3`,
});
export const onStartRecord = async setIsRecording => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsRecording(true);
        const result = await AudioRecorderPlay.startRecorder(path, audioSet);
        AudioRecorderPlay.addRecordBackListener(e => {
          console.log(e);
          console.log(e.currentPosition);
        });
        console.log(result, 'this is on start result');
      } else {
        console.log('Recording permission denied.');
        // You can show an alert or take appropriate action if permission is not granted.
      }
    } else {
      setIsRecording(true);
      const result = await AudioRecorderPlay.startRecorder();
      AudioRecorderPlay.addRecordBackListener(e => {
        console.log(e);
        console.log(e.currentPosition);
      });
    }
  } catch (error) {
    console.log('Error occurred while checking recording permission:', error);
  }
};

export async function onStopRecord(setrecordingUrl, setvoiceAttachment) {
  const result = await AudioRecorderPlay.stopRecorder();
  AudioRecorderPlay.removeRecordBackListener();
  console.log(result, '=-=-=');
  setrecordingUrl(result);
  setvoiceAttachment([
    {
      title: 'recording',
      key: '123',
      resourceUrl: result,
      contentType: 'audio/mpeg',
      encoding: '',
    },
  ]);
}

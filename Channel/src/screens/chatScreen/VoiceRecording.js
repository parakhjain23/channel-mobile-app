import {View, Text, PermissionsAndroid, Button, Platform} from 'react-native';
import React, {useEffect, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

export const AudioRecorderPlay = new AudioRecorderPlayer();

export const onStartRecord = async setIsRecording => {
  try {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setIsRecording(true);
        const result = await AudioRecorderPlay.startRecorder();
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
  console.log(result,'=-=-=');
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

export const onStartPlay = async () => {
  const result = await AudioRecorderPlay.startPlayer();
  AudioRecorderPlay.addPlayBackListener(e => {
    // console.log(e);
    // console.log(e.currentPosition);
  });
};

export const onStopPlay = async () => {
  const result = await AudioRecorderPlay.stopPlayer();
  AudioRecorderPlay.removePlayBackListener();
};

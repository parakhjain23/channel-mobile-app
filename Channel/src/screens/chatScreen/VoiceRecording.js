import {View, Text, PermissionsAndroid, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const AudioRecorderPlay = new AudioRecorderPlayer();
const VoiceRecording = () => {
  const [recordingUrl, setrecordingUrl] = useState('');
  useEffect(() => {
    requestPermission();
  }, []);
  const onStartRecord = async () => {
    const result = await AudioRecorderPlay.startRecorder();
    AudioRecorderPlay.addRecordBackListener(e => {
      console.log(e);
      console.log(e.currentPosition);
    });
    console.log(result, 'this is on start result');
  };

  async function onStopRecord() {
    const result = await AudioRecorderPlay.stopRecorder();
    AudioRecorderPlay.removeRecordBackListener();
    console.log(result, 'this is result on stop');
    setrecordingUrl(result);
  }

  const onStartPlay = async () => {
    const result = await AudioRecorderPlay.startPlayer();
    AudioRecorderPlay.addPlayBackListener(e => {
      console.log(e);
      console.log(e.currentPosition);
    });
  };
ƒ
  return (
    <View>
      <Button title="Start Recording" onPress={onStartRecord} />
      <Button title="Stop Recording" onPress={onStopRecord} />
      <Button title="Start play Recording" onPress={onStartPlay} />
      <Button title="Stop Play Recording" onPress={onStopPlay} />
      <Button title="Upload Sound" onPress={uploadSound} />
      <Text>VoiceRecording</Text>
    </View>
  );
};

export default VoiceRecording;
export const onStartRecord = async () => {
  const result = await AudioRecorderPlay.startRecorder();
  AudioRecorderPlay.addRecordBackListener(e => {
    console.log(e);
    console.log(e.currentPosition);
  });
  console.log(result, 'this is on start result');
};

export async function onStopRecord(setrecordingUrl, setvoiceAttachment) {
  const result = await AudioRecorderPlay.stopRecorder();
  AudioRecorderPlay.removeRecordBackListener();
  console.log(result,'=-=-=result on stop record =-=-=-=');

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
async function requestPermission() {
  if (Platform.OS === 'android') {
    try {
      const grants = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);

      console.log('write external stroage', grants);

      if (
        grants['android.permission.WRITE_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.READ_EXTERNAL_STORAGE'] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        grants['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permissions granted');
      } else {
        console.log('All required permissions not granted');
        return;
      }
    } catch (err) {
      console.warn(err);
      return;
    }
  }
}

import {View, Text, PermissionsAndroid, Button} from 'react-native';
import React, {useEffect, useState} from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import uuid from 'react-native-uuid';

const AudioRecorderPlay = new AudioRecorderPlayer();
const VoiceRecording = () => {
  const [recordingUrl, setrecordingUrl] = useState('');
  useEffect(() => {
    requestPermission();
  });
  const uploadSound = async () => {
    try {
      const folder = uuid.v4();
      const presignedUrl = await fetch(
        'https://api.intospace.io/chat/fileUpload',
        {
          method: 'POST',
          headers: {
            Authorization:
            'token',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileNames: [`${folder}/sound.mp4`],
          }),
        },
      );
      const Genereated_URL = await presignedUrl.json();
      const signedUrls = Object.values(Genereated_URL);
      console.log(signedUrls, '=-=-=-');
      const uploadPromises = signedUrls.map(async (s3BucketUrl, index) => {
        const fileUri = await fetch(recordingUrl);
        const audioBody = await fileUri.blob();
        const fileType = audioBody?._data?.type;
        await UploadDocumentApi(s3BucketUrl, fileType, audioBody);
        return `${folder}/sound.mp4`;
      });
      const uploadedFileNames = await Promise.all(uploadPromises);
      return uploadedFileNames;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  const UploadDocumentApi = async (s3BucketUrl, fileType, imageBody) => {
    await fetch(s3BucketUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      body: imageBody,
    });
  };

  const onStartRecord = async () => {
    const result = await AudioRecorderPlay.startRecorder();
    AudioRecorderPlay.addRecordBackListener(e => {
      console.log(e);
      console.log(e.currentPosition);
    });
    console.log(result, 'this is on start result');
  };

  const onStopRecord = async () => {
    const result = await AudioRecorderPlay.stopRecorder();
    AudioRecorderPlay.removeRecordBackListener();
    console.log(result, 'this is result on stop');
    setrecordingUrl(result);
  };

  const onStartPlay = async () => {
    const result = await AudioRecorderPlay.startPlayer();
    AudioRecorderPlay.addPlayBackListener(e => {
      console.log(e);
      console.log(e.currentPosition);
    });
  };

  const onStopPlay = async () => {
    const result = await AudioRecorderPlay.stopPlayer();
    AudioRecorderPlay.removePlayBackListener();
  };
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

import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';

export const uploadRecording = async (recordingUrl, accessToken) => {
  try {
    const Files = [
      {
        name: 'sound.mp3',
        uri: recordingUrl,
        type: 'audio/mp3',
      },
    ];
    const FileNames = await FileUploadApi(Files, accessToken);
    const attachment = FileNames?.map((file, index) => {
      return {
        title: file,
        key: file,
        resourceUrl: `https://resources.intospace.io/${file}`,
        contentType: 'audio/mp3',
        encoding: '',
      };
    });
    return attachment;
  } catch (error) {
    console.warn(error, 'error');
  }
};

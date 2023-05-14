import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';

export const uploadRecording = async (recordingUrl, accessToken) => {
  try {
    const Files = [
      {
        name: `sound.mp4`,
        uri: recordingUrl,
        type: 'audio/mpeg',
      },
    ];
    const FileNames = await FileUploadApi(Files, accessToken);
    console.log(FileNames, 'filename in voice picker');
    const attachment = FileNames?.map((file, index) => {
      return {
        title: file,
        key: file,
        resourceUrl: `https://resources.intospace.io/${file}`,
        contentType: 'audio/mpeg',
        encoding: '',
      };
    });
    return attachment;
  } catch (error) {
    console.warn(error, 'error');
  }
};

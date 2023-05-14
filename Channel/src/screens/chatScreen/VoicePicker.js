import {FileUploadApi} from '../../api/attachmentsApi/FileUploadApi';
import uuid from 'react-native-uuid';

export const uploadRecording = async (
  recordingUrl,
  setAttachment,
  accessToken,
  //   setAttachmentLoading,
) => {
  // setAttachmentLoading(true);
  try {
    const folder = uuid.v4();
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
      console.log(file, 'filel lajlkfjdlkajdf lj');
      return {
        title: file,
        key: file,
        resourceUrl: `https://resources.intospace.io/${file}`,
        contentType: 'audio/mpeg',
        encoding: '',
      };
    });
    //   setAttachmentLoading(false);
    setAttachment(prevAttachment => [...prevAttachment, ...attachment]);
  } catch (error) {
    console.warn(error, 'error');
  }
};

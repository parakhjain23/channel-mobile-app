import DocumentPicker from 'react-native-document-picker';
import { FileUploadApi } from '../../api/attachmentsApi/FileUploadApi';

export const pickDocument = async (setAttachment, accessToken,setAttachmentLoading) => {
  try {
    const Files = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
      allowMultiSelection: true,
      readContent: true,
    });
    setAttachmentLoading(true);
    try {
      const FileNames = await FileUploadApi(Files, accessToken);
      const attachment = FileNames?.map((file, index) => {
        return {
          title: Files[index]?.name,
          key: file,
          resourceUrl: `https://resources.intospace.io/${file}`,
          contentType: Files[index]?.type,
          // size: 18164,
          encoding: '',
        };
      });
      setAttachmentLoading(false);
      setAttachment(prevAttachment => [...prevAttachment, ...attachment]);
    } catch (error) {
      console.warn(error, 'error');
    }
  } catch (err) {
    if (DocumentPicker.isCancel(err)) {
      setAttachmentLoading(false);
    } else {
      setAttachmentLoading(false);
    }
  }
};

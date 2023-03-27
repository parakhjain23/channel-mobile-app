import uuid from 'react-native-uuid';

export const FileUploadApi = async (Files, accessToken) => {
  const fileNames = Files?.map(item => {
    const folder = uuid.v4();
    return `${folder}/${item?.name || item?.fileName}`;
  });

  try {
    const presignedUrl = await fetch(
      'https://api.intospace.io/chat/fileUpload',
      {
        method: 'POST',
        headers: {
          Authorization: accessToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileNames: fileNames,
        }),
      },
    );
    const Genereated_URL = await presignedUrl.json();
    const signedUrls = Object.values(Genereated_URL);

    // Create an array of upload promises
    const uploadPromises = signedUrls.map(async (s3BucketUrl, index) => {
      const fileData = new FormData();
      fileData.append('file', {
        uri: Files[index]?.uri,
        type: Files[index]?.type,
        name: Files[index]?.name || Files[index]?.fileName,
      });
      await UploadDocumentApi(s3BucketUrl, fileData);
    });

    // Wait for all uploads to finish
    await Promise.all(uploadPromises);

    return fileNames;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


const UploadDocumentApi = async (s3BucketUrl, fileType, imageBody) => {
  const uploadDocToS3 = await fetch(s3BucketUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': fileType,
    },
    body: imageBody,
  });
  //   const downloadDocUrl = JSON.stringify(uploadDocToS3);
  //   console.log(downloadDocUrl, 'result from upload document api');
};

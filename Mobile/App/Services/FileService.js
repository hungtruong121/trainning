import {Api} from './Api';

function upload(data) {
  return Api.post('/file/uploads', data, true);
}

function read(data) {
  return Api.get('/file/reads', data, true);
}

function deleteFile(data) {
  return Api.get('file/delete', data, true);
}

async function uploadImage(image) {
  const FileTypes = {
    JPG: 'image/jpeg',
    PNG: 'image/png',
  };

  let data = new FormData();
  const fileType = image.filename.split('.').pop();
  const type = FileTypes[fileType.toUpperCase()];

  data.append('files', {
    uri: image.uri,
    name: image.filename,
    type: type,
  });

  return await new Promise((resolve, reject) => {
    upload(data).then((response) => resolve(response));
  });
}

export const fileService = {
  upload,
  read,
  deleteFile,
  uploadImage,
};

import fs from 'fs';

export default function(path) {
  let _path = `${dotenv.storagePath}/${path}`;

  if (!fs.existsSync(_path)) {
    fs.mkdirSync(_path);
  }

  return _path;
}

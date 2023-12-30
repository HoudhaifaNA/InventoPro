import { unlink } from 'node:fs/promises';
import path from 'node:path';

const deleteFile = (fileName: string) => {
  let folderPath = 'public/uploads';
  if (process.env.NODE_ENV === 'production') folderPath = 'resources/uploads';

  const filePath = path.join(path.resolve(), folderPath, fileName);
  unlink(filePath);
};

export default deleteFile;

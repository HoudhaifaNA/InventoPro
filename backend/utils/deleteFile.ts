import { unlink } from 'node:fs/promises';
import path from 'node:path';

import AppError from './AppError';

const deleteFile = async (fileName: string) => {
  try {
    let folderPath = 'uploads';
    if (process.env.NODE_ENV === 'production') folderPath = 'resources/uploads';

    const filePath = path.join(path.resolve(), folderPath, fileName);
    await unlink(filePath);
  } catch (err) {
    throw new AppError("Erreur lors de la suppression de l'image.", 403);
  }
};

export default deleteFile;

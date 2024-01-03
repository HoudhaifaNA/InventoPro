import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { nanoid } from 'nanoid';

import AppError from './AppError';

const handleFileUpload = async (file: Express.Multer.File) => {
  const fileName = `atc-${nanoid()}-${file.originalname}`;
  try {
    const fileBuffer = file.buffer;
    const buffer = Buffer.from(fileBuffer);

    let folderPath = 'uploads';
    if (process.env.NODE_ENV === 'production') folderPath = 'resources/uploads';

    const filePath = path.join(path.resolve(), folderPath, fileName);

    await writeFile(filePath, buffer);

    return fileName;
  } catch (err) {
    throw new AppError("Une erreur s'est produite lors de l'enregistrement d'image.", 403);
  }
};

export default handleFileUpload;

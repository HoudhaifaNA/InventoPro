import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { nanoid } from 'nanoid';

const handleFileUpload = async (file: File) => {
  const fileName = `atc-${nanoid()}-${file.name}`;
  try {
    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);

    let folderPath = 'public/uploads';
    if (process.env.NODE_ENV === 'production') folderPath = 'resources/uploads';

    const filePath = path.join(path.resolve(), folderPath, fileName);

    await writeFile(filePath, buffer);

    return fileName;
  } catch (err) {
    console.log(err);
    throw Error('Error saving file');
  }
};

export default handleFileUpload;

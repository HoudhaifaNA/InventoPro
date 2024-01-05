import path from 'path';
import catchAsync from '../utils/catchAsync';

const attachmentController = catchAsync((req, res) => {
  const { filename } = req.params;

  const isProd: boolean = process.env.NODE_ENV === 'production';
  const filePath = path.join(path.resolve(), isProd ? 'resources/uploads' : 'uploads', filename);

  res.status(200).sendFile(filePath);
});

export default attachmentController;

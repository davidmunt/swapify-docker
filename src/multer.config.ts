import { diskStorage } from 'multer';
import * as path from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './src/upload/img/', 
    filename: (req, file, callback) => {
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 20 * 1024 * 1024, 
  },
};

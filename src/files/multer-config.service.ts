import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { config } from 'dotenv';
config();
import { GridFsStorage } from 'multer-gridfs-storage/lib/gridfs';
const url = process.env.MONGODB_URI;

@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
  private gridFsStorage: GridFsStorage;
  constructor() {
    this.gridFsStorage = new GridFsStorage({
      url: url,
      file: (_req, file) => {
        return new Promise((resolve, _reject) => {
            const filename = `${Date.now()}-${file.originalname}`;
            const fileInfo = {
                filename: filename,
            };
            resolve(fileInfo);
        });
      }    
    });
  }

  createMulterOptions(): MulterModuleOptions {
    return {
      storage: this.gridFsStorage,
    };
  }
}

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import {
  GridFSBucket,
  GridFSBucketReadStream,
  MongoClient,
  ObjectId,
} from 'mongodb';
import { FileInfoVm } from './view-models/file-info-vm.model';

@Injectable()
export class FilesService {
  private fileModel: MongoGridFS;
  private bucket: GridFSBucket;

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.fileModel = new MongoGridFS(this.connection.db, 'fs');
    const client = new MongoClient(process.env.MONGODB_URI);
    client.connect().then(() => {
      const db = client.db('test');
      this.bucket = new GridFSBucket(db, { bucketName: 'fs' });
    });
  }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async findInfo(id: string): Promise<FileInfoVm> {
    const result = await this.fileModel
      .findById(id)
      .catch(() => {
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      })
      .then((result) => result);
    return {
      filename: result.filename,
      length: result.length,
      chunkSize: result.chunkSize,
      contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }

  async processJsonStream(fileId: ObjectId): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
      const stream = this.bucket.openDownloadStream(fileId);
      let jsonString = '';

      stream
        .on('data', (chunk) => {
          jsonString += chunk.toString();
        })
        .on('end', () => {
          try {
            const data = JSON.parse(jsonString);
            if (!Array.isArray(data)) {
              throw new Error('El JSON no contiene un array válido.');
            }
            const secondElement = data[1];
            if (
              secondElement &&
              secondElement.values &&
              secondElement.values.serial_number
            ) {
              resolve(secondElement.values.serial_number);
            } else {
              console.warn('El segundo elemento no contiene "serial_number".');
              resolve(null);
            }
          } catch (error) {
            reject(`Error al parsear el JSON: ${error.message}`);
          }
        })
        .on('error', (err) => {
          reject(`Error al leer el archivo: ${err.message}`);
        });
    });
  }
}

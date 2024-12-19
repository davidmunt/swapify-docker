import { Expose } from 'class-transformer';

export class FileInfoVm {
  @Expose()
  length: number;

  @Expose()
  chunkSize: number;

  @Expose()
  filename: string;

  @Expose()
  contentType: string;
}

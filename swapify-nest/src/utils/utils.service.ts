import { Injectable } from '@nestjs/common';
import * as convert from 'xml-js';

@Injectable()
export class UtilsService {
  convertJSONtoXML(json: string): string {
    const options = { compact: true, ignoreComment: true, spaces: 4 };
    return convert.json2xml(json, options);
  }
}

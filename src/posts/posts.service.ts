import { Injectable } from '@nestjs/common';

function getValidExtensions(): RegExp {
  const extensions = (process.env.VALID_EXTENSIONS || '.*')
    .split(',')
    .join('|');
  //   console.log(extensions);

  return new RegExp(`([a-z])+(${extensions})$`);
}

function getDestPath(): string {
  return process.env.DEST_PATH || 'uploads';
}

@Injectable()
export class PostService {}

import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class FileTypeValidationPipe implements PipeTransform {
  fileTypes = ['image/png', 'image/jpeg', 'image/jpg'];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(values: Express.Multer.File[], metadata: ArgumentMetadata) {
    console.log(values);

    let isValid: boolean = false;
    values.forEach((value) => {
      isValid = this.fileTypes.includes(value.mimetype);
      if (!isValid) {
        throw new BadRequestException('Invalid file type');
      }
    });
    return values;
  }
}

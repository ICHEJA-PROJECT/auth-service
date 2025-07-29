import * as sharp from 'sharp';
import jsQR from 'jsqr';
import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { QRRepository } from 'src/auth/domain/repositories';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class QRRepositoryImp implements QRRepository {
  private readonly logger = new Logger(QRRepositoryImp.name);

  async readQR(imageBuffer: Buffer): Promise<string> {
    if (!imageBuffer || imageBuffer.length === 0) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'No image file provided or the file is empty',
      });
    }

    try {
      const { data, info } = await sharp(imageBuffer)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });

      const code = jsQR(
        new Uint8ClampedArray(data.buffer),
        info.width,
        info.height,
      );

      if (code && code.data) {
        return code.data;
      } else {
        throw new RpcException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Could not decode QR code. No QR code found in the image.',
        });
      }
    } catch (error) {
      this.logger.error(
        'Failed to process image with sharp or read QR code with jsQR',
        error.stack,
      );
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid or corrupted image file format',
      });
    }
  }
}

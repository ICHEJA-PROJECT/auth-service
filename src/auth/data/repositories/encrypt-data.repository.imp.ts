import { HttpStatus, Injectable } from '@nestjs/common';
import { EncryptDataRepository } from 'src/auth/domain/repositories';
import { envsValues } from 'src/core/config/getEnvs';
import * as crypto from 'crypto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class EncryptDataRepositoryImp implements EncryptDataRepository {
  private encryptionKey = envsValues.ENCRYPTION_KEY;
  private ivLength = 16;

  encrypt(text: string): string {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptionKey),
        iv,
      );
      let encrypted = cipher.update(text);
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Encryption failed',
      });
    }
  }

  decrypt(encryptedText: string): string {
    try {
      const [ivHex, encryptedHex] = encryptedText.split(':');
      if (!ivHex || !encryptedHex) {
        throw new Error('Invalid encrypted text format');
      }
      const iv = Buffer.from(ivHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');
      const decipher = crypto.createDecipheriv(
        'aes-256-cbc',
        Buffer.from(this.encryptionKey),
        iv,
      );
      let decrypted = decipher.update(encrypted);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      return decrypted.toString();
    } catch (error) {
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Decryption failed',
      });
    }
  }
}

export interface EncryptDataRepository {
  encrypt(text: string): string;
  decrypt(encryptedText: string): string;
}

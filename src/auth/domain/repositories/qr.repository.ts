export interface QRRepository {
  readQR(imageBuffer: Buffer): Promise<string>;
}

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const TAG_POSITION = SALT_LENGTH + IV_LENGTH;
const ENCRYPTED_POSITION = TAG_POSITION + TAG_LENGTH;

export class CryptoService {
  private static getKey(password: string, salt: Buffer): Buffer {
    return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha512");
  }

  /**
   * Encrypts plaintext using AES-256-GCM.
   */
  public static encrypt(text: string, secretKey: string): string {
    if (!text) return text;
    
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = this.getKey(secretKey, salt);
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    const tag = cipher.getAuthTag();
    
    return Buffer.concat([salt, iv, tag, encrypted]).toString("base64");
  }

  /**
   * Decrypts ciphertext using AES-256-GCM.
   */
  public static decrypt(cipherText: string, secretKey: string): string {
    if (!cipherText) return cipherText;
    
    try {
      const buffer = Buffer.from(cipherText, "base64");
      
      const salt = buffer.subarray(0, SALT_LENGTH);
      const iv = buffer.subarray(SALT_LENGTH, TAG_POSITION);
      const tag = buffer.subarray(TAG_POSITION, ENCRYPTED_POSITION);
      const encrypted = buffer.subarray(ENCRYPTED_POSITION);
      
      const key = this.getKey(secretKey, salt);
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      decipher.setAuthTag(tag);
      
      return decipher.update(encrypted) + decipher.final("utf8");
    } catch (error) {
      throw new Error("Failed to decrypt sensitive data.");
    }
  }
}

/**
 * AES-256-GCM encryption/decryption for SAP credentials stored in DB.
 * Key must be 32 bytes (64 hex chars) set via ENCRYPTION_KEY env var.
 */

function getKey(): Buffer {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length < 64) {
    throw new Error("ENCRYPTION_KEY must be a 64-char hex string (32 bytes)");
  }
  return Buffer.from(hex.slice(0, 64), "hex");
}

export async function encrypt(plaintext: string): Promise<string> {
  const { createCipheriv, randomBytes } = await import("crypto");
  const key = getKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // Format: iv(24 hex) + authTag(32 hex) + ciphertext(hex)
  return iv.toString("hex") + authTag.toString("hex") + encrypted.toString("hex");
}

export async function decrypt(ciphertext: string): Promise<string> {
  const { createDecipheriv } = await import("crypto");
  const key = getKey();
  const iv = Buffer.from(ciphertext.slice(0, 24), "hex");
  const authTag = Buffer.from(ciphertext.slice(24, 56), "hex");
  const encrypted = Buffer.from(ciphertext.slice(56), "hex");
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(authTag);
  return decipher.update(encrypted).toString("utf8") + decipher.final("utf8");
}

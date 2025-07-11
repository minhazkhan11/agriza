import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = "this-is-my-secret-key-for-token";
export const encryptData = (text) => {
  const ciphertext = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY);
  return ciphertext.toString();
};
export const decryptData = (encryptedData) => {
  if (!encryptedData) {
    console.error("Encrypted data is null or undefined.");
    return null; 
  }
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    return null; 
  }
};

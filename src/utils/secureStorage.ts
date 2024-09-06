import * as Keychain from 'react-native-keychain';

export const getSecureStorage = async () => {
  const keychainItem = await Keychain.getGenericPassword();
  if (keychainItem) {
    return new Uint8Array(Buffer.from(keychainItem.password, 'base64'));
  } else {
    // Generate a new key if it does not exist
    const key = new Uint8Array(64);
    crypto.getRandomValues(key); // or use an alternative random key generation method
    await Keychain.setGenericPassword('encryption_key', Buffer.from(key).toString('base64'));
    return key;
  }
};

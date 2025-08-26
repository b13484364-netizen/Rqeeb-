export async function calculateHash(file) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyImageAgainstStoredKey(file, storedHash) {
  const currentHash = await calculateHash(file);
  return currentHash === storedHash;
}

export function storeNewKey(hash) {
  localStorage.setItem("keynova_hash", hash);
}

export function getStoredKeyHash() {
  return localStorage.getItem("keynova_hash");
}

export function removeStoredKey() {
  localStorage.removeItem("keynova_hash");
}

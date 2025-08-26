// حفظ المفتاح
export function saveHashLocally(hash) {
    localStorage.setItem("keynova_hash", hash);
  }
  
  // التحقق من المفتاح المدخل
  export function verifyHash(hashToCompare) {
    const storedHash = localStorage.getItem("keynova_hash");
    return storedHash === hashToCompare;
  }
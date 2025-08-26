import jsSHA from "jssha";

export async function getImageHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const imageData = event.target.result;
      const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
      shaObj.update(imageData);
      const hash = shaObj.getHash("HEX");
      resolve(hash);
    };

    reader.onerror = function () {
      reject("Failed to read file");
    };

    reader.readAsArrayBuffer(file);
  });
}

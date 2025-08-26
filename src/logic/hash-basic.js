async function calculateHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // حجم قياسي
        const cropSize = Math.min(img.width, img.height) * 0.6; // 60% من الأبعاد
        const offsetX = (img.width - cropSize) / 2;
        const offsetY = (img.height - cropSize) / 2;

        canvas.width = 300;
        canvas.height = 300;

        // قص المنطقة المركزية وتوحيد الحجم
        ctx.drawImage(img, offsetX, offsetY, cropSize, cropSize, 0, 0, 300, 300);

        // تحويل إلى أبيض وأسود
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

        // استخراج البيانات النهائية
        canvas.toBlob(async (blob) => {
          const arrayBuffer = await blob.arrayBuffer();
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
          const hashArray = Array.from(new Uint8Array(hashBuffer));
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
          resolve(hashHex);
        }, 'image/png');
      };

      img.onerror = reject;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

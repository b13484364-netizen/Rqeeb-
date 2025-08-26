// دالة تحليل صورة واحدة تحتوي الأصل والمُشتبه فيه
async function analyzeSingleImage(file) {
  const result = document.getElementById('resultMessage');
  const progress = document.getElementById('matchProgress');

  if (!file) {
    result.innerText = "⚠️ يرجى اختيار صورة تحتوي الأصل والمُشتبه به معًا";
    return;
  }

  result.innerText = "⏳ جاري التحليل...";

  const hashLeft = await calculateHalfHash(file, 'left');
  const hashRight = await calculateHalfHash(file, 'right');
  const percent = calculateSimilarity(hashLeft, hashRight);

  progress.value = percent;
  if (percent >= 90) result.innerText = `✅ تطابق ${percent}% - مطابق تمامًا`;
  else if (percent >= 70) result.innerText = `⚠️ تطابق ${percent}% - تحقق يدوي`;
  else result.innerText = `❌ تطابق ${percent}% - محتمل تزوير`;
}

// دالة لاقتطاع وتحليل نصف الصورة (يسار أو يمين)
async function calculateHalfHash(file, side = 'left') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const halfWidth = img.width / 2;
        const height = img.height;

        canvas.width = 300;
        canvas.height = 300;

        const sx = side === 'left' ? 0 : halfWidth;
        ctx.drawImage(img, sx, 0, halfWidth, height, 0, 0, 300, 300);

        // معالجة رمادية لتوحيد اللون وتقليل التشويش
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }
        ctx.putImageData(imageData, 0, 0);

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

// دالة حساب نسبة التشابه بين التجزئتين
function calculateSimilarity(hashA, hashB) {
  let match = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] === hashB[i]) match++;
  }
  return Math.floor((match / hashA.length) * 100);
}

export function evaluateMaterialTextureGLCM(canvasA, canvasB) {
  const getGrayLevels = (ctx, width, height) => {
    const data = ctx.getImageData(0, 0, width, height).data;
    const gray = [];
    for (let i = 0; i < data.length; i += 4) {
      const avg = Math.round((data[i] + data[i+1] + data[i+2]) / 3);
      gray.push(avg);
    }
    return gray;
  };

  const calculateContrast = (grayData, width) => {
    let contrast = 0;
    for (let y = 0; y < width - 1; y++) {
      for (let x = 0; x < width - 1; x++) {
        const i = y * width + x;
        const current = grayData[i];
        const neighbor = grayData[i + 1];
        contrast += Math.pow(current - neighbor, 2);
      }
    }
    return contrast;
  };

  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');
  const w = canvasA.width;
  const h = canvasA.height;

  const grayA = getGrayLevels(ctxA, w, h);
  const grayB = getGrayLevels(ctxB, w, h);

  const contrastA = calculateContrast(grayA, w);
  const contrastB = calculateContrast(grayB, w);

  const diff = Math.abs(contrastA - contrastB);
  const normalized = Math.max(contrastA, contrastB) || 1;

  const textureScore = 100 - Math.min((diff / normalized) * 100, 100);
  return Math.round(textureScore);
} 

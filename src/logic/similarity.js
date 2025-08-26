export function evaluateMaterialMatch(canvasA, canvasB) {
  const ctxA = canvasA.getContext('2d');
  const ctxB = canvasB.getContext('2d');

  const imgA = ctxA.getImageData(0, 0, canvasA.width, canvasA.height).data;
  const imgB = ctxB.getImageData(0, 0, canvasB.width, canvasB.height).data;

  let brightnessDiff = 0;
  let redBlueDiff = 0;

  for (let i = 0; i < imgA.length; i += 4) {
    const avgA = (imgA[i] + imgA[i+1] + imgA[i+2]) / 3;
    const avgB = (imgB[i] + imgB[i+1] + imgB[i+2]) / 3;
    brightnessDiff += Math.abs(avgA - avgB);

    const diffA = Math.abs(imgA[i] - imgA[i+2]);
    const diffB = Math.abs(imgB[i] - imgB[i+2]);
    redBlueDiff += Math.abs(diffA - diffB);
  }

  const pixels = imgA.length / 4;
  const brightnessScore = 100 - Math.min(brightnessDiff / pixels, 100);
  const textureScore = 100 - Math.min((redBlueDiff / pixels) * 2, 100);

  return Math.round((brightnessScore + textureScore) / 2);
}

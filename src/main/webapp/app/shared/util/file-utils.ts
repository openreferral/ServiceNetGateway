/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param maxWidth maximum output width
 */
export const getCroppedImg = (image, crop, maxWidth = 0) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const cropWidth = crop.width || image.width;
  const cropHeight = crop.height || image.height;
  const cropX = crop.width ? crop.x : 0;
  const cropY = crop.height ? crop.y : 0;
  let outWidth = cropWidth;
  let outHeight = cropHeight;
  if (maxWidth > 0 && outWidth > maxWidth) {
    outWidth = maxWidth;
    outHeight = outHeight * (maxWidth / outWidth);
  }
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, cropX * scaleX, cropY * scaleY, cropWidth * scaleX, cropHeight * scaleY, 0, 0, outWidth, outHeight);

  // As Base64 string
  return canvas.toDataURL('image/jpeg');
};

export const toBase64 = file =>
  new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = error => {
      reject(error);
    };
  });

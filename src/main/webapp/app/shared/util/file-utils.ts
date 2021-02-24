/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} dimensions - image dimensions
 */
export const getCroppedImg = (image, dimensions) => {
  const canvas = document.createElement('canvas');

  canvas.width = dimensions.width;
  canvas.height = dimensions.height;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(image, dimensions.x, dimensions.y, dimensions.w, dimensions.h, 0, 0, dimensions.width, dimensions.height);

  // As Base64 string
  return canvas.toDataURL('image/jpeg');
};

/**
 * @param {HTMLImageElement} image - Image File Object
 * @param {Object} crop - crop Object
 * @param maxWidth maximum output width
 */
export const getCroppedImgDimensions = (image, crop, maxWidth = 0) => {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const cropWidth = crop.width || image.width;
  const cropHeight = crop.height || image.height;
  const cropX = crop.width ? crop.x : 0;
  const cropY = crop.height ? crop.y : 0;
  let outWidth = cropWidth;
  let outHeight = cropHeight;
  if (maxWidth > 0 && outWidth > maxWidth) {
    outHeight = outHeight * (maxWidth / outWidth);
    outWidth = maxWidth;
  }
  return { height: outHeight, width: outWidth, x: cropX * scaleX, y: cropY * scaleY, w: cropWidth * scaleX, h: cropHeight * scaleY };
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

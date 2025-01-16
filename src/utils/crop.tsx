export const createImage = (url: any) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // Needed to avoid cross-origin issues on CodeSandbox
      image.src = url;
    });
  
  export const getCroppedImg = async (imageSrc: any, pixelCrop: any) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
  
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
  
    ctx && ctx.drawImage(
      image as any,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );
  
    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          reject(new Error('Canvas is empty'));
          return;
        }
        // const fileUrl = URL.createObjectURL(blob);
        resolve(blob);
      }, 'image/jpeg');
    });
  };
  
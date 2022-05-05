/**
 * utils
 */
export const openFileDialog = (inputRef) => {
  if (inputRef.current) {
    inputRef.current.click();
  }
};

export const getAcceptTypeString = (acceptType) => {
  return acceptType && acceptType.length > 0
    ? acceptType.map((item) => `.${item}`).join(", ")
    : "image/*";
};

export const getBase64 = (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.addEventListener("load", (e) => {
      const getWidthHeight = new Promise(reslv => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          reslv({ width: image.width, height: image.height });
        };
      });
      getWidthHeight.then(res => {
        return resolve({
          size: { ...res },
          dataURL: String(reader.result),
        });
      });
    });
    reader.readAsDataURL(file);
  });
};

export const getImage = (file) => {
  const image = new Image();
  return new Promise((resolve) => {
    image.addEventListener("load", () => resolve(image));
    image.src = URL.createObjectURL(file);
  });
};

export const getListFiles = (files, dataURLKey) => {
  const promiseFiles = [];
  for (let i = 0; i < files.length; i += 1) {
    promiseFiles.push(getBase64(files[i]));
  }
  return Promise.all(promiseFiles).then((fileListBase64) => {
    const fileList = fileListBase64.map((data, index) => ({
      [dataURLKey]: data.dataURL,
      file: files[index],
      size: data.size
    }));
    return fileList;
  });
};

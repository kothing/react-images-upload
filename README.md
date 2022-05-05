# react-images-upload

<div align="center">
  <img src="https://user-images.githubusercontent.com/6290720/91559755-9d6e8c00-e973-11ea-9bde-4b60c89f441a.png" width="250" />
</div>

The simple images uploader applied `Render Props` pattern. (You can read more about this pattern [here](https://reactjs.org/docs/render-props.html)).

This approach allows you to fully control UI component and behaviours.

- [Usage](#usage)
- [Props](#props)
  - [Note](#note)
- [Exported options](#exported-options)

## Usage

You can check out the basic demo here:

- Javascript: [https://codesandbox.io/s/react-images-uploading-demo-u0khz](https://codesandbox.io/s/react-images-uploading-demo-u0khz)

**Basic**

```jsx
import React from 'react';
import ImageUpload from './react-images-upload';

export function App() {
  const [images, setImages] = React.useState([]);
  const maxFileSize = 10;

  const onChange = (imageList) => {
    // data for submit
    console.log(imageList);
    setImages(imageList);
  };

  return (
    <div className="App">
      <ImageUpload
        imageList={images}
        uploadUrl="/upload.json"
        acceptType={["png", "jpeg", "jpg", "gif", ".tiff"]}
        maxFileSize={maxFileSize * 1000000}
        formDataName="file" // formData.append(formDataName, item)
        onChange={onChange}
        onSuccess={onSuccess}
        onError={onError}
      >
        <div className="en">UPLOAD IMAGE HERE</div>
      </ImageUpload>
    </div>
  );
}
```

## Props

| parameter        | type                                | options                                   | default | description                                                        |
| ---------------- | ----------------------------------- | ----------------------------------------- | ------- | ------------------------------------------------------------------ |
| imageList        | array                               |                                           | []      | List of images                                                     |
| uploadUrl        | string                               |                                           |       | upload url                                                     |
| onChange         | function                            | (imageList, addUpdateIndex) => void       |         | Called when add, update or delete action is called                 |
| dataURLKey       | string                              |                                           | dataURL | Customized field name that base64 of selected image is assigned to |
| multiple         | boolean                             |                                           | false   | Set `true` for multiple chooses                                    |
| maxNumber        | number                              |                                           | 1000    | Number of images user can select if mode = `multiple`              |
| onError          | function                            | (errors, files) => void                   |         | Called when it has errors                                          |
| acceptType       | array                               | ['jpg', 'gif', 'png']                     | []      | The file extension(s) to upload                                    |
| maxFileSize      | number                              |                                           |         | Max image size (Byte) and it is used in validation                 |
| resolutionType   | string                              | 'absolute' \| 'less' \| 'more' \| 'ratio' |         | Using for image validation with provided width & height            |
| resolutionWidth  | number                              | > 0                                       |         |                                                                    |
| resolutionHeight | number                              | > 0                                       |         |                                                                    |
| inputProps       | React.HTMLProps\<HTMLInputElement\> |                                           |         |                                                                    |

### Note

**resolutionType**

| value    | description                                                              |
| :------- | :----------------------------------------------------------------------- |
| absolute | image's width === resolutionWidth && image's height === resolutionHeight |
| ratio    | (resolutionWidth / resolutionHeight) === (image width / image height)    |
| less     | image's width < resolutionWidth && image's height < resolutionHeight     |
| more     | image's width > resolutionWidth && image's height > resolutionHeight     |

## Exported options

| parameter        | type                                      | description                                                         |
| :--------------- | :---------------------------------------- | :------------------------------------------------------------------ |
| imageList        | array                                     | List of images to render.                                           |
| onImageUpload    | function                                  | Called when an element is clicks and triggers to open a file dialog |
| onImageRemoveAll | function                                  | Called when removing all images                                     |
| onImageUpdate    | (updateIndex: number) => void             | Called when updating an image at `updateIndex`.                     |
| onImageRemove    | (deleteIndex: number \| number[]) => void | Called when removing one or list image.                             |
| errors           | object                                    | Exported object of validation                                       |
| dragProps        | object                                    | Native element props for drag and drop feature                      |
| isDragging       | boolean                                   | "true" if an image is being dragged                                 |

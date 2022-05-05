import React from "react";
import ReactDOM from "react-dom";
import ImageUpload from "./ImagesUpload";
import "./styles.css";

const maxFileSize = 10;

function App() {
  const [images, setImages] = React.useState([]);

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };

  const onSuccess = (res) => {
    console.log(res);
  };

  const onError = (err) => {
    console.log(err);
  };

  return (
    <div className="App">
      <ImageUpload
        imageList={images}
        uploadUrl="/upload.json"
        acceptType={["png", "jpeg", "jpg", "gif", ".tiff"]}
        maxFileSize={maxFileSize * 1000000}
        formDataName="file"
        onChange={onChange}
        onSuccess={onSuccess}
        onError={onError}
      >
        <div className="en">UPLOAD IMAGE</div>
      </ImageUpload>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

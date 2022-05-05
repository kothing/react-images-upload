/* eslint-disable no-unused-expressions */
import React, { useRef, useState, useCallback, useMemo } from "react";
import { openFileDialog, getListFiles, getAcceptTypeString } from "./utils";
import { getErrorValidation } from "./validation";
import { DEFAULT_NULL_INDEX, INIT_MAX_NUMBER, DEFAULT_DATA_URL_KEY } from "./constants";
import ajaxUpload from "./ajaxUpload";
import "./index.less";

const ImageUpload = ({
  imageList = [],
  uploadUrl = "",
  onChange,
  onUpload,
  onSuccess,
  onError,
  children,
  dataURLKey = DEFAULT_DATA_URL_KEY,
  multiple = true,
  maxNumber = INIT_MAX_NUMBER,
  acceptType,
  maxFileSize,
  resolutionWidth,
  resolutionHeight,
  resolutionType,
  inputProps = {},
  autoPending = false,
  showRemoveAll = true,
  wrapperClass,
  className,
}) => {
  const inValue = (imageList || []).map((m) => {
    const n = { ...m };
    if (!n.uniKey) {
      n.uniKey = new Date().getTime();
    }
    return n;
  });
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [keyUpdate, setKeyUpdate] = useState(DEFAULT_NULL_INDEX);
  const [errors, setErrors] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClickInput = useCallback(() => openFileDialog(inputRef), [inputRef]);

  const onImageUpload = useCallback(() => {
    setKeyUpdate(DEFAULT_NULL_INDEX);
    handleClickInput();
  }, [handleClickInput]);

  const onImageRemoveAll = useCallback(() => {
    onChange?.([]);
  }, [onChange]);

  const onImageRemove = (index) => {
    const updatedList = [...inValue];
    if (Array.isArray(index)) {
      index.forEach((i) => {
        updatedList.splice(i, 1);
      });
    } else {
      updatedList.splice(index, 1);
    }
    onChange?.(updatedList);
  };

  const onImageUpdate = (index) => {
    setKeyUpdate(index);
    handleClickInput();
  };

  const validate = async (fileList) => {
    const errorsValidation = await getErrorValidation({
      fileList,
      maxFileSize,
      maxNumber,
      acceptType,
      keyUpdate,
      resolutionType,
      resolutionWidth,
      resolutionHeight,
      value: inValue,
    });
    if (errorsValidation) {
      setErrors(errorsValidation);
      onError?.(errorsValidation, fileList);
      return false;
    }
    errors && setErrors(null);
    return true;
  };

  const handleChange = async (files) => {
    if (!files) {
      return;
    }
    const fileList = await getListFiles(files, dataURLKey);
    if (!fileList.length) {
      return;
    }
    const checkValidate = await validate(fileList);
    if (!checkValidate) {
      return;
    }
    let updatedFileList;
    const updatedIndexes = [];
    if (keyUpdate > DEFAULT_NULL_INDEX) {
      const [firstFile] = fileList;
      updatedFileList = [...inValue];
      updatedFileList[keyUpdate] = firstFile;
      updatedIndexes.push(keyUpdate);
    } else if (multiple) {
      updatedFileList = [...inValue, ...fileList];
      for (let i = inValue.length; i < updatedFileList.length; i += 1) {
        updatedIndexes.push(i);
      }
    } else {
      updatedFileList = [fileList[0]];
      updatedIndexes.push(0);
    }
    onChange?.(updatedFileList, updatedIndexes);
  };

  const onInputChange = async (e) => {
    await handleChange(e.target.files);
    if (keyUpdate > DEFAULT_NULL_INDEX) {
      setKeyUpdate(DEFAULT_NULL_INDEX);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    if (autoPending) {
      handleUpload();
    }
  };

  const acceptTypeString = useMemo(() => getAcceptTypeString(acceptType), [acceptType]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleChange(e.dataTransfer.files);
    }
  };

  const handleDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.clearData();
  };

  const handleUpload = () => {
    setUploading(true);
    onUpload?.();
    const options = {
      headers: {},
      withCredentials: {},
      data: inValue.map((item) => item.file),
      url: uploadUrl,
      onProgress: (e) => {
        console.log(e);
      },
      onSuccess: (res) => {
        setUploading(false);
        onSuccess?.(res);
      },
      onError: (err) => {
        setUploading(false);
        onError?.(err);
      },
    };
    ajaxUpload(options);
  };

  return (
    <div
      className={`image-uploader-wrapper${
        wrapperClass || className ? ` ${wrapperClass || className}` : ""
      }`}
    >
      <input
        className="native-input"
        type="file"
        accept={acceptTypeString}
        ref={inputRef}
        multiple={multiple && keyUpdate === DEFAULT_NULL_INDEX}
        onChange={onInputChange}
        {...inputProps}
      />

      <div
        className="drag-box"
        style={isDragging ? { color: "red" } : null}
        onClick={onImageUpload}
        onDrop={handleDrop}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDragStart={handleDragStart}
      >
        {children || "Click or Drop here"}
      </div>
      {inValue.length > 0 && (
        <div className="images-list">
          {inValue.map((image, index) => (
            <div key={image.uniKey} className="image-item">
              <div className="image-preview">
                <img src={image[dataURLKey]} alt={image.file.name} width="140" />
              </div>
              <div className="image-action-btn">
                <button className="update button" onClick={() => onImageUpdate(index)}>
                  Update
                </button>
                <button className="remove button" onClick={() => onImageRemove(index)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          {showRemoveAll && (
            <button className="remove-all button" onClick={onImageRemoveAll}>
              Remove all images
            </button>
          )}
        </div>
      )}
      {!autoPending && (
        <div className="images-upload">
          <button
            className={`button${inValue.length <= 0 ? " disabled" : ""}`}
            disabled={inValue.length <= 0}
            onClick={inValue.length > 0 ? () => handleUpload() : () => {}}
          >
            {uploading ? "Uploading ..." : "Uplod"}
          </button>
        </div>
      )}
    </div>
  );
};

export { ajaxUpload };

export default ImageUpload;

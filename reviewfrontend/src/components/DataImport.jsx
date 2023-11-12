import React, { useRef, useState } from 'react';
import Navbar from '../shared/Navbar';
import styles from '../assets/DataImport.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

function DataImport() {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadResponse, setUploadResponse] = useState(null);
  const user_email = JSON.parse(localStorage.getItem('user'))?.email;

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const fileType = uploadedFile.name.split('.').pop().toLowerCase();
      if (['csv', 'xls', 'xlsx'].includes(fileType)) {
        setFile(uploadedFile);
      } else {
        setErrorMessage('Please upload a valid CSV or Excel file.');
      }
    }
  };

  const handleUploadClick = async () => {
    if (file) {
      setIsLoading(true);
      await uploadFile(file);
      setIsLoading(false);
    } else {
      setErrorMessage('Please select a file to upload.');
    }
  };

  const handleClassifyClick = async () => {
    if (uploadResponse) { 
      setIsLoading(true);
      try {
        const response = await axios.post(`${apiUrl}/classify-data/`, uploadResponse, {
          headers: {
            'Content-Type': 'multipart/json',
          },
        });
        if (response.status === 200) {
          localStorage.setItem('sentiment_summary', JSON.stringify(response.data.classified_data));
          localStorage.setItem('uploadFile', JSON.stringify(uploadResponse));
          alert(response.data.message);
          navigate('/visualization');
        }
      } catch (error) {
        setErrorMessage('Error classifying data. Please try again later.');
        console.log(error);
      }
      setIsLoading(false);
    } else {
      setErrorMessage('Please upload a file first.');
    }
  };

  const handleCancelClick = () => {
    fileInputRef.current.value = null;
    setFile(null);
    setIsFileUploaded(false);
    setErrorMessage(null);
  };

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_email', user_email);
    formData.append('file_name', file.name);
    try {
      const response = await axios.post(`${apiUrl}/upload-review-file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadResponse(response.data);
      alert('File Uploaded Successfully');
      setIsFileUploaded(true);
    } catch (error) {
      setErrorMessage('Error uploading file. Please try again later.');
      console.log(error);
    }
  };

  return (
    <div className="dashboard-background">
      <Navbar activePage="DataImport" />
      <div className={styles.container}>
        <div className={styles.dragDropSection}>
          <h2>Drag and Drop</h2>
          <div
            className={styles.dragDropBox}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv, .xls, .xlsx"
              style={{ display: 'none' }}
            />
            <div className={styles.iconBox}>
              <FontAwesomeIcon icon={faFileUpload} />
              <p>
                {file ? file.name : 'Click or drag and drop to upload'}
              </p>
            </div>
          </div>
          {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          <div className={styles.btnGroup}>
            <button
              className={styles.btn + ' ' + styles.btnCancel}
              onClick={handleCancelClick}
            >
              Cancel
            </button>
            {!isFileUploaded && (
              <button
                className={styles.btn + ' ' + styles.btnUpload}
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                {isLoading ? 'Uploading...' : 'Upload'}
              </button>
            )}
            {isFileUploaded && (
              <button
                className={styles.btn + ' ' + styles.btnClassify}
                onClick={handleClassifyClick}
                disabled={isLoading}
              >
                {isLoading ? 'Classifying...' : 'Classify'}
              </button>
            )}
          </div>
          {isLoading && (
            <div className={styles.loadingGraphics}>
              <ClipLoader size={50} color={"#123abc"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DataImport;
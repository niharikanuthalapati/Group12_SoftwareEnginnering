import React, { useRef, useState } from 'react';
import Navbar from '../shared/Navbar';
import styles from '../assets/Compare.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

function Compare() {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const [files, setFiles] = useState({ file1: null, file2: null });
    const [errorMessage, setErrorMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const user_email = JSON.parse(localStorage.getItem('user'))?.email;

    const handleFileChange = (index) => (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const fileType = uploadedFile.name.split('.').pop().toLowerCase();
            if (['csv', 'xls', 'xlsx'].includes(fileType)) {
                setFiles(prevFiles => ({ ...prevFiles, [`file${index}`]: uploadedFile }));
            } else {
                setErrorMessage('Please upload a valid CSV or Excel file.');
            }
        }
    };

    const handleCompareClick = async () => {
        if (files.file1 && files.file2) {
          setIsLoading(true);
          setErrorMessage(null);
          try {
            const response1 = await uploadFile(files.file1);
            const response2 = await uploadFile(files.file2);
            if (response1 && response2) {
              const classifyResponse1 = await handleClassify(response1.data);
              const classifyResponse2 = await handleClassify(response2.data);
      
              if (classifyResponse1 && classifyResponse2) {
                // Logic to compare the classified data from both files
                localStorage.setItem('classifyResponse1', JSON.stringify(classifyResponse1));
                localStorage.setItem('classifyResponse2', JSON.stringify(classifyResponse2));
                alert('Both files uploaded and classified successfully. Ready to compare.');
                navigate('/VisualizationCompare');
                return;
              }
            }
          } catch (error) {
            setErrorMessage('Error during file processing. Please try again later.');
            console.error(error);
          }
      
          setIsLoading(false);
        } else {
          setErrorMessage('Please select both files to upload.');
        }
      };
      
      const handleClassify = async (uploadResponse) => {
        try {
          const response = await axios.post(`${apiUrl}/classify-data/`, uploadResponse, {
            headers: {
              'Content-Type': 'multipart/json',
            },
          });
          if (response.status === 200) {
            return response.data.classified_data;
          }
        } catch (error) {
          setErrorMessage('Error classifying data. Please try again later.');
          console.error(error);
          return null; // Ensure you return null in case of an error for consistent function behavior
        }
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
          return response;
        } catch (error) {
          setErrorMessage(`Error uploading file ${file.name}. Please try again later.`);
          console.error(error);
          return null; // Return null to indicate failure
        }
      };
      

    const handleCancelClick = (index) => () => {
        const fileInputRef = index === 1 ? fileInputRef1 : fileInputRef2;
        fileInputRef.current.value = null;
        setFiles(prevFiles => ({ ...prevFiles, [`file${index}`]: null }));
        setErrorMessage(null);
    };


    return (
        <div className="dashboard-background">
            <Navbar activePage="Compare" />
            <div className={styles.container}>
                <div className={styles.fileUploadContainer}>
                    {[1, 2].map(index => (
                        <div className={styles.dragDropSection} key={index}>
                            <h2>{`Product ${index}`}</h2>
                            <div
                                className={styles.dragDropBox}
                                onClick={() => (index === 1 ? fileInputRef1 : fileInputRef2).current.click()}
                            >
                                <input
                                    type="file"
                                    ref={index === 1 ? fileInputRef1 : fileInputRef2}
                                    onChange={handleFileChange(index)}
                                    accept=".csv, .xls, .xlsx"
                                    style={{ display: 'none' }}
                                />
                                <div className={styles.iconBox}>
                                    <FontAwesomeIcon icon={faFileUpload} />
                                    <p>
                                        {files[`file${index}`] ? files[`file${index}`].name : 'Click or drag and drop to upload'}
                                    </p>
                                </div>
                            </div>
                            <button
                                className={styles.btn + ' ' + styles.btnCancel}
                                onClick={handleCancelClick(index)}
                            >
                                Cancel
                            </button>
                        </div>
                    ))}
                </div>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                <button
                    className={styles.btn + ' ' + styles.btnCompare}
                    onClick={handleCompareClick}
                    disabled={isLoading || !(files.file1 && files.file2)}
                >
                    {isLoading ? 'Comparing...' : 'Compare'}
                </button>
                {isLoading && (
                    <div className={styles.loadingGraphics}>
                        <ClipLoader size={50} color={"#123abc"} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default Compare;

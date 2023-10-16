import React, { useRef, useState } from 'react';
import Navbar from '../shared/Navbar';
import styles from '../assets/DataImport.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileUpload } from '@fortawesome/free-solid-svg-icons';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function DataImport() {
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const uploadedFile = event.target.files[0];
        if (uploadedFile) {
            const fileType = uploadedFile.name.split('.').pop().toLowerCase();
            if (['csv', 'xls', 'xlsx'].includes(fileType)) {
                setFile(uploadedFile);
                parseData(uploadedFile, fileType);
            } else {
                setErrorMessage('Please upload a valid CSV or Excel file.');
            }
        }
    };

    const parseData = (file, fileType) => {
        setErrorMessage(null);
        try {
            if (fileType === 'csv') {
                Papa.parse(file, {
                    complete: (result) => {
                        if (result.errors.length) {
                            setErrorMessage('Error parsing CSV data. Please check your file format.');
                        } else {
                            alert("File Uploaded successfully")
                            // Apply NLP algorithm on result.data
                        }
                    },
                    header: true
                });
            } else if (['xls', 'xlsx'].includes(fileType)) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const workbook = XLSX.read(event.target.result, { type: 'binary' });
                    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                    const data = XLSX.utils.sheet_to_json(firstSheet);
                    
                    alert("File Uploaded successfully",data)
                    // Apply NLP algorithm on data
                };
                reader.onerror = () => {
                    setErrorMessage('Error reading Excel file. Please check your file format.');
                };
                reader.readAsBinaryString(file);
            }
        } catch (error) {
            setErrorMessage('An error occurred while processing the file.');
        }
    };

    return (
        <div>    
            <Navbar activePage="DataImport" />
            <div className={styles.container}>  {/* Note the change here */}
                <div className={styles.dragDropSection}> {/* And here */}
                    <h2>Drag and Drop</h2>
                    <div className={styles.dragDropBox} onClick={() => fileInputRef.current.click()}> {/* And all such places */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept=".csv, .xls, .xlsx"
                            style={{ display: 'none' }}
                        />
                        <div className={styles.iconBox}> {/* And so on */}
                            <FontAwesomeIcon icon={faFileUpload} /> 
                            <p>{file ? file.name : 'Click or drag and drop to upload'}</p>
                        </div>
                    </div>
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} {/* Here */}
                    <div className={styles.btnGroup}> {/* And here */}
                        <button className={styles.btn + " " + styles.btnCancel}>Cancel</button>
                        <button className={styles.btn + " " + styles.btnClassify}>Classify</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DataImport;

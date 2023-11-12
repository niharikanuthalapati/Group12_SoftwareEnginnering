import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import styles from '../assets/reportGeneration.module.css';
import { useNavigate } from 'react-router-dom';

function ReportGeneration() {
    const [reportPaths, setReportPaths] = useState({ pdf: '', docx: '' });
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    const review_file_id = JSON.parse(localStorage.getItem('uploadFile'))?.id;
    const colorOptions = JSON.parse(localStorage.getItem('colorOptions'));

    const fetchReportData = async () => {
        if (!review_file_id) {
            alert('Please submit data file first.');
            navigate('/import');
            return;
        }

        try {
            const response = await axios.get(`${apiUrl}/generatereportdata/`, {
                params: { review_file_id, colorOptions }
            });
            setReportPaths(response.data);
        } catch (error) {
            if (error.response && error.response.data.error === 'Please submit data file first.') {
                alert('Please submit data file first.');
                navigate('/import');
            } else {
                console.error('Error fetching report data:', error);
            }
        }
    };

    const downloadPDF = () => {
        window.open(`${apiUrl}`+reportPaths.pdf_path, '_blank');
    };

    const downloadWord = () => {
        window.open(`${apiUrl}`+reportPaths.docx_path, '_blank');
    };

    return (
        <div>
          <Navbar activePage="ReportGeneration" />
          <div className={styles.container}>
            <h2 className={styles.heading}>Report Generation</h2>
            <button className={`btn btn-primary ${styles.button}`} onClick={fetchReportData}>
              Generate Report
            </button>
            <div className={styles.downloadButtons}>
              {reportPaths.pdf_path && (
                <div className={styles.buttonContainer}>
                  <h3 className={styles.subHeading}>Report can be downloaded in PDF format</h3>
                  <button className={`btn btn-secondary ${styles.downloadButton} ${styles.downloadPdf}`} onClick={downloadPDF}>
                    Download PDF
                  </button>
                </div>
              )}
              {reportPaths.docx_path && (
                <div className={styles.buttonContainer}>
                  <h3 className={styles.subHeading}>Report can be downloaded in WORD format</h3>
                  <button className={`btn btn-secondary ${styles.downloadButton} ${styles.downloadDocx}`} onClick={downloadWord}>
                    Download Word
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );      
}

export default ReportGeneration;

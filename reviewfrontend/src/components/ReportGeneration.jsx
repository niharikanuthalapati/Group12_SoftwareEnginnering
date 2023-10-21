import React, { useState } from 'react';
import axios from 'axios';
import FileSaver from 'file-saver';
import Navbar from '../shared/Navbar';
import styles from '../assets/reportGeneration.module.css';
import htmlDocx from 'html-docx-js/dist/html-docx';
import { jsPDF } from 'jspdf';


function ReportGeneration() {
    const [reportData, setReportData] = useState(null);
    const apiUrl = process.env.REACT_APP_API_URL;

    // Fetch report data from API
    const fetchReportData = async () => {
        try {
            let response = await axios.get(`${apiUrl}/generatereportdata/`);
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    }

    // Convert JSON data to HTML for display or conversion to other formats
    const jsonToHtml = (data) => {
        let html = '<h1>' + data.title + '</h1>';
        html += '<p>Total Reviews: ' + data.total_reviews + '</p>';
        html += '<p>Positive Reviews: ' + data.positive_reviews + '</p>';
        html += '<p>Negative Reviews: ' + data.negative_reviews + '</p>';
        html += '<p>Average Rating: ' + data.average_rating + '</p>';
        html += '<ul>';
        data.suggestions.forEach(suggestion => {
            html += '<li>' + suggestion + '</li>';
        });
        html += '</ul>';
        return html;
    }

    const downloadPDF = () => {
        const pdf = new jsPDF();
        const htmlContent = jsonToHtml(reportData);
        
        pdf.html(htmlContent, {
            callback: function (pdf) {
                pdf.save('report.pdf');
            },
            x: 10,
            y: 10
        });
    }

    const downloadWord = () => {
        const content = jsonToHtml(reportData);
        const converted = htmlDocx.asBlob(content);
        FileSaver.saveAs(converted, 'report.docx');
    }

    return (
        <div>
            <Navbar activePage="ReportGeneration" />

            <div className={styles.container}>

                <h2 className={styles.heading}>Report Generation</h2>

                <button className={`btn btn-primary ${styles.button}`} onClick={fetchReportData}>Generate Report</button>

                {reportData && (
                    <div>
                        <h3 className={styles.heading}>Report can be downloaded in PDF format</h3>
                        <button className={`btn btn-secondary ${styles.button}`} onClick={downloadPDF}>Download</button>

                        <h3 className={styles.heading}>Report can be downloaded in WORD format</h3>
                        <button className={`btn btn-secondary ${styles.button}`} onClick={downloadWord}>Download</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReportGeneration;

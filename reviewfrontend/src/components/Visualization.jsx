import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Pie, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import styles from '../assets/visualization.module.css';

const Visualization = () => {
    const navigate = useNavigate();
    const [selectedVisualization, setSelectedVisualization] = useState('PieChart');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sentiment_summary = JSON.parse(localStorage.getItem('sentiment_summary'))
    useEffect(() => {
        // fetch('http://127.0.0.1:8000/visualization')
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Network response was not ok');
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         setData(data);
        //         setLoading(false);
        //     })
        //     .catch(error => {
        //         setError(error);
        //         setLoading(false);
        //     });
        if (!sentiment_summary) navigate('/import');
        setData(sentiment_summary);
        setLoading(false);
    }, []
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <Navbar activePage="Visualization" />

            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <ul className="list-group mb-5">
                        <li className={selectedVisualization === 'PieChart' ? "list-group-item active" : "list-group-item"} onClick={() => setSelectedVisualization('PieChart')}>Pie Chart</li>
                        <li className={selectedVisualization === 'BarGraph' ? "list-group-item active" : "list-group-item"} onClick={() => setSelectedVisualization('BarGraph')}>Bar Graph</li>
                        <li className={selectedVisualization === 'TextFormat' ? "list-group-item active" : "list-group-item"} onClick={() => setSelectedVisualization('TextFormat')}>Text Format</li>
                    </ul>
                </div>
                <div className={styles.contentArea}>
                    {selectedVisualization === 'PieChart' && <Pie data={data} key="PieChart" />}
                    {selectedVisualization === 'BarGraph' && <Bar data={data} key="BarGraph" />}
                    {selectedVisualization === 'TextFormat' &&
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Review Type</th>
                                    <th>Percentage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.labels.map((label, index) => (
                                    <tr key={index}>
                                        <td>{label}</td>
                                        <td>{data.datasets[0].data[index]}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            </div>
        </div>
    );
}

export default Visualization;

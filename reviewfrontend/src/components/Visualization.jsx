import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Pie, Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import styles from '../assets/visualization.module.css';
import ScatterPlot from './ScatterPlot';

const colorOptions = [
    ['#FF6384', '#36A2EB', '#FFCE56'], // Color Combo 1
    ['#6050DC', '#D52DB7', '#FF2E63'], // Color Combo 2
    ['#00A8E8', '#A9E34B', '#F0C808']  // Color Combo 3
];

const Visualization = () => {
    const navigate = useNavigate();
    const [selectedVisualization, setSelectedVisualization] = useState('PieChart');
    const [data, setData] = useState(null);
    const [selectedColors, setSelectedColors] = useState(colorOptions[0]);
    const [loading, setLoading] = useState(true);
    const [reviewText, setReviewText] = useState('');
    const [error] = useState(null);
    const [clusterData, setClusterData] = useState(null);
    const sentiment_summary = JSON.parse(localStorage.getItem('sentiment_summary'))
    const [clusterPoints, setClusterPoints] = useState(null);

    useEffect(() => {
        if (!sentiment_summary) {
            navigate('/import');
            return;
        }
        const summaryData = sentiment_summary.sentiment_summary;
        summaryData.datasets[0].backgroundColor = selectedColors;
        summaryData.datasets[0].label = "Sentiment";
        setData(summaryData);
        setReviewText(sentiment_summary.review_text);
        setClusterData(sentiment_summary.cluster_samples);
        localStorage.setItem('colorOptions', JSON.stringify(selectedColors));
        if (sentiment_summary && sentiment_summary.cluster_points && !clusterPoints) {
            const clustersArray = Object.entries(sentiment_summary.cluster_points).map(([clusterId, points]) => {
                return { id: parseInt(clusterId, 10) + 1, points };
            });
            setClusterPoints(clustersArray);
        }
        setLoading(false);
    }, [selectedColors]);

    const handleColorChange = (colorIndex) => {
        setSelectedColors(colorOptions[colorIndex]);

    };

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
                        <li className={selectedVisualization === 'Clusterspoints' ? "list-group-item active" : "list-group-item"} onClick={() => setSelectedVisualization('Clusterspoints')}>Clusters Points</li>
                        <li className={selectedVisualization === 'Clusterstxt' ? "list-group-item active" : "list-group-item"} onClick={() => setSelectedVisualization('Clusterstxt')}>Clusters Text</li>
                    </ul>
                </div>
                <div className={styles.contentArea}>
                    <div className={styles.chartContainer}>
                        {selectedVisualization === 'PieChart' && <Pie data={data} key="PieChart" />}
                        {selectedVisualization === 'BarGraph' && <Bar data={data} key="BarGraph" />}
                        {selectedVisualization === 'TextFormat' &&
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>Review Type</th>
                                        <th>Total</th>
                                        <th>Percentage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.labels.map((label, index) => (
                                        <tr key={index}>
                                            <td>{label}</td>
                                            <td>{data.datasets[0].data[index]}</td>
                                            <td>{data.datasets[0].percentages[index].toFixed(2)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        }
                        {selectedVisualization === 'Clusterstxt' &&
                            <div className={styles.clusterContainer}>
                                {clusterData && Object.entries(clusterData).map(([cluster, reviews], index) => (
                                    <div key={index}>
                                        <h3 className={styles.clusterHeading}>Cluster {parseInt(cluster) + 1}</h3>
                                        <div className={styles.clusterContent}>[{reviews.join(', ')}]</div>
                                    </div>
                                ))}
                            </div>
                        }
                        {selectedVisualization === 'Clusterspoints' && clusterPoints &&
                            <ScatterPlot clusterData={clusterPoints} />
                        }

                        {selectedVisualization === 'PieChart' || selectedVisualization === 'BarGraph' ? (
                            <div className={styles.colorOptions}>
                                {colorOptions.map((colors, index) => (
                                    <div key={index} className={styles.colorOption}>
                                        <input
                                            type="radio"
                                            id={`colorOption${index}`}
                                            name="colorOption"
                                            value={index}
                                            checked={selectedColors === colors}
                                            onChange={() => handleColorChange(index)}
                                        />
                                        <label htmlFor={`colorOption${index}`}>
                                            {colors.map((color, colorIndex) => (
                                                <span key={colorIndex} style={{ backgroundColor: color }} className={styles.colorSwatch}></span>
                                            ))}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                    </div>
                    {selectedVisualization !== 'Clusterstxt' && selectedVisualization !== 'Clusterspoints' &&
                        <div className={styles.reviewText}>
                            <p>{reviewText}</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default Visualization;

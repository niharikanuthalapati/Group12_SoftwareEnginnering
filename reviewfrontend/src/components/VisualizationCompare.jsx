import React, { useState, useEffect } from 'react';
import Navbar from '../shared/Navbar';
import { Pie, Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import ScatterPlot from './ScatterPlot';
import styles from '../assets/visualizationCompare.module.css';

const VisualizationCompare = () => {
    const [selectedVisualization, setSelectedVisualization] = useState('PieChart');
    const [data1, setData1] = useState(null);
    const [data2, setData2] = useState(null);
    const [reviewText1, setReviewText1] = useState('');
    const [reviewText2, setReviewText2] = useState('');
    const [clusterData1, setClusterData1] = useState(null);
    const [clusterData2, setClusterData2] = useState(null);
    const [clusterPoints1, setClusterPoints1] = useState(null);
    const [clusterPoints2, setClusterPoints2] = useState(null);
    const classifyResponse1 = JSON.parse(localStorage.getItem('classifyResponse1'));
    const classifyResponse2 = JSON.parse(localStorage.getItem('classifyResponse2'));

    useEffect(() => {
        if (classifyResponse1 && classifyResponse1.sentiment_summary) {
            setData1(classifyResponse1.sentiment_summary);
            setReviewText1(classifyResponse1.review_text);
            setClusterData1(classifyResponse1.cluster_samples);
            const clustersArray = Object.entries(classifyResponse1.cluster_points).map(([clusterId, points]) => {
                return { id: parseInt(clusterId, 10) + 1, points };
            });
            setClusterPoints1(clustersArray);
        }
        if (classifyResponse2 && classifyResponse2.sentiment_summary) {
            setData2(classifyResponse2.sentiment_summary);
            setReviewText2(classifyResponse2.review_text);
            setClusterData2(classifyResponse2.cluster_samples);
            const clustersArray = Object.entries(classifyResponse2.cluster_points).map(([clusterId, points]) => {
                return { id: parseInt(clusterId, 10) + 1, points };
            });
            setClusterPoints2(clustersArray);
        }
        localStorage.removeItem('classifyResponse1');
        localStorage.removeItem('classifyResponse2');            
    }, []);

    return (
        <div>
            <Navbar activePage="VisualizationCompare" />
            <div className={styles.container}>
                <div className={styles.sidebar}>
                    <ul className="list-group mb-5">
                        {['PieChart', 'BarGraph', 'TextFormat', 'Clusters', 'ClusterPoints'].map((visualizationType) => (
                            <li
                                key={visualizationType}
                                className={selectedVisualization === visualizationType ? "list-group-item active" : "list-group-item"}
                                onClick={() => setSelectedVisualization(visualizationType)}
                            >
                                {visualizationType.replace(/([A-Z])/g, ' $1').trim()}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.contentArea}>
                    {selectedVisualization === 'PieChart' && data1 && data2 && (
                        <div className={styles.chartContainer}>
                            <Pie data={data1} />
                            <Pie data={data2} />
                        </div>
                    )}
                    {selectedVisualization === 'BarGraph' && data1 && data2 && (
                        <div className={styles.chartContainer}>
                            <Bar data={data1} />
                            <Bar data={data2} />
                        </div>
                    )}
                    {selectedVisualization === 'TextFormat' && (
                        <div className={styles.chartContainer}>
                            {data1 && <TextFormatTable data={data1} styles={styles} />}
                            {data2 && <TextFormatTable data={data2} styles={styles} />}
                        </div>
                    )}

                    {selectedVisualization === 'Clusters' && (
                        <div className={styles.clustersContainer}>
                            {clusterData1 && <ClusterDisplay clusterData={clusterData1} styles={styles} />}
                            {clusterData2 && <ClusterDisplay clusterData={clusterData2} styles={styles} />}
                        </div>
                    )}
                    {selectedVisualization === 'ClusterPoints' &&
                        <div className={styles.pointContainer}>
                            <ScatterPlot clusterData={clusterPoints1} />
                            <ScatterPlot clusterData={clusterPoints2} />
                        </div>
                    }

                    {selectedVisualization !== 'Clusters' && selectedVisualization !== 'ClusterPoints' && (
                        <div className={styles.reviewText}>
                            <p>{reviewText1}</p>
                            <p>{reviewText2}</p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

const TextFormatTable = ({ data, styles }) => (
    <table className={styles.table}>
        <thead>
            <tr>
                <th>Review Type</th>
                <th>Total</th>
                <th>Percentage</th>
            </tr>
        </thead>
        <tbody>
            {data?.labels.map((label, index) => (
                <tr key={index}>
                    <td>{label}</td>
                    <td>{data.datasets[0].data[index]}</td>
                    <td>{data.datasets[0].percentages[index].toFixed(2)}%</td>
                </tr>
            ))}
        </tbody>
    </table>
);

const ClusterDisplay = ({ clusterData, styles }) => (
    <div className={styles.clusterContainer}>
        {clusterData && Object.entries(clusterData).map(([cluster, reviews], index) => (
            <div key={index}>
                <h3 className={styles.clusterHeading}>Cluster {parseInt(cluster) + 1}</h3>
                <div className={styles.clusterContent}>[{reviews.join(', ')}]</div>
            </div>
        ))}
    </div>
);

export default VisualizationCompare;

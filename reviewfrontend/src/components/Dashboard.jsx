import React from 'react';
import Navbar from '../shared/Navbar';

const Dashboard = () => {
    return (
        <div>
            <Navbar activePage="Dashboard" />

            <div className="container mt-5">
                <h1 className="text-center mb-4">Welcome to the dashboard of the User Reviews Classification</h1>

                <div className="row">
                    <div className="col-md-3">
                        <ul className="list-group mb-5">
                            <li className="list-group-item">Imported Review</li>
                            <li className="list-group-item">Classification result</li>
                            <li className="list-group-item">Feedback History</li>
                        </ul>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <div className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Imported Text File</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Result of previous Input</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">Given user feedback</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

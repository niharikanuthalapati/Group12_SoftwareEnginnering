import React from 'react';
import Navbar from '../shared/Navbar';
import '../assets/DataImport.css';


function DataImport() {
    return (
        <div>    
            <Navbar activePage="DataImport" />
            <div className="container data-import-container">
                <div className="drag-drop-section">
                    <h2>Drag and Drop</h2>
                    <div className="drag-drop-box">
                        <div className="icon-box">
                            <i className="fas fa-file-upload"></i>
                            <p>Frame</p>
                        </div>
                    </div>
                    <div className="btn-group">
                        <button className="btn btn-cancel">Cancel</button>
                        <button className="btn btn-classify">Classify</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default DataImport;

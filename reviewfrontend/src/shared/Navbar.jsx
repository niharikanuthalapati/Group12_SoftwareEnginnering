// import React from 'react';
// import { useUser } from '../UserContext';
// import userlogo from '../assets/logo.png';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../assets/styles.css';

// const Navbar = ({ activePage }) => {
//     const { user, logout } = useUser();

//     const handleDisabledClick = (e) => {
//         e.preventDefault();
//     };

//     const isLinkDisabled = (link) => {
//         if (['Dashboard', 'DataImport'].includes(link)) {
//             return false;
//         } else if (activePage === 'Visualization' && ['Feedback'].includes(link)) {
//             return false;
//         } else if (activePage === 'Feedback' && ['ReportGeneration'].includes(link)) {
//             return false;
//         } else if (activePage === 'ReportGeneration') {
//             return false;
//         }
//         return true;
//     };

//     return (
//         <nav className="navbar navbar-expand-lg navbar-dark">
//             <a className="navbar-brand" href="dashboard">
//                 <img src={userlogo} alt="User Reviews" width="100" height="50" />
//             </a>
//             <div className="navbar-nav">
//                 <a
//                     className={`nav-item nav-link ${activePage === 'Dashboard' ? 'active' : ''
//                         }`}
//                     href="dashboard"
//                 >
//                     Dashboard
//                 </a>
//                 <a
//                     className={`nav-item nav-link ${activePage === 'DataImport' ? 'active' : ''
//                         }`}
//                     href="import"
//                 >
//                     Data Import
//                 </a>
//                 <a
//                     className={`nav-item nav-link ${activePage === 'Visualization' ? 'active' : ''
//                         } ${isLinkDisabled('Visualization') ? 'disabled' : ''}`}
//                     href="visualization"
//                     onClick={isLinkDisabled('Visualization') ? handleDisabledClick : undefined}
//                 >
//                     Visualization
//                 </a>
//                 <a
//                     className={`nav-item nav-link ${activePage === 'Feedback' ? 'active' : ''
//                         } ${isLinkDisabled('Feedback') ? 'disabled' : ''}`}
//                     href="feedback"
//                     onClick={isLinkDisabled('Feedback') ? handleDisabledClick : undefined}
//                 >
//                     Feedback
//                 </a>
//                 <a
//                     className={`nav-item nav-link ${activePage === 'ReportGeneration' ? 'active' : ''
//                         } ${isLinkDisabled('ReportGeneration') ? 'disabled' : ''}`}
//                     href="report"
//                     onClick={isLinkDisabled('ReportGeneration') ? handleDisabledClick : undefined}
//                 >
//                     Report Generation
//                 </a>
//             </div>
//             <div className="user-info">
//                 {user && <span className="navbar-text">Welcome, {user.first_name}!</span>}
//                 {user && (
//                     <button className="logout-button" onClick={logout}>
//                         Logout
//                     </button>
//                 )}
//             </div>
//         </nav>
//     );
// };

// export default Navbar;


/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { useUser } from '../UserContext';
import userlogo from '../assets/logo.png'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/styles.css';

const Navbar = ({ activePage }) => {
    const { user, logout } = useUser();
    return (
        <nav className="navbar navbar-expand-lg navbar-dark">
            <a className="navbar-brand" href="dashboard">
                <img src={userlogo} alt="User Reviews"  width="100" height="50" />
            </a>
            <div className="navbar-nav">
                <a className={`nav-item nav-link ${activePage === "Dashboard" ? "active" : ""}`} href="dashboard">Dashboard</a>
                <a className={`nav-item nav-link ${activePage === "DataImport" ? "active" : ""}`} href="import">Data Import</a>
                <a className={`nav-item nav-link ${activePage === "Visualization" ? "active" : ""}`} href="visualization">Visualization</a>
                <a className={`nav-item nav-link ${activePage === "Feedback" ? "active" : ""}`} href="feedback">Feedback</a>
                <a className={`nav-item nav-link ${activePage === "ReportGeneration" ? "active" : ""}`} href="report">Report Generation</a>
            </div>
            <div className="user-info">
                {user && <span className="navbar-text">Welcome, {user.first_name}!</span>}
                {user && <button className="logout-button" onClick={logout}>Logout</button>}
            </div>
        </nav>
    );
};

export default Navbar;

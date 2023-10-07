import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/main.css';
import userlogo from '../assets/logo.png'


const Home = () => {

    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    const handleRegisterClick = () => {
        navigate('/register');
    }

    return (
        <div className="welcome-container">
            <h1>Welcome to User Reviews</h1>
            <div className="logo-container">
                <img src={userlogo} alt="User Reviews"/>
            </div>
            <div className="button-container">
                <button className="login-button" onClick={handleLoginClick}>Log In</button>
                <button className="signin-button" onClick={handleRegisterClick}>Register</button>
            </div>
        </div>
        
    );
}

export default Home;

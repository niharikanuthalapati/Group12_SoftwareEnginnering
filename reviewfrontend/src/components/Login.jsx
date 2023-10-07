import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/main.css';
import userlogo from '../assets/logo.png'
import { useUser } from '../UserContext';

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    }

    const handleCancel = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://127.0.0.1:8000/login/', loginData);
            if (response.status === 200 && response.data.user) {
                setUser(response.data.user);
                localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user in local storage
            }
        } catch (error) {
            if (error.response && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert('Failed to log in:', error);
            }
        }
    }
    

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-5">
                <img src={userlogo} alt="User Reviews" className="logo"/>
                    <div className="card">
                        <div className="card-header">
                            <h5 className="text-center">LOGIN</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="text" name="email" className="form-control" placeholder="Email" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} />
                                </div>
                                <div className="d-flex justify-content-between">
                                    <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
                                    <button type="submit" className="btn">Login</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;

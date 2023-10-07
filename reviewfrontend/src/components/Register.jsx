import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/main.css';
import userlogo from '../assets/logo.png'

const Register = () => {
    const [registerData, setRegisterData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        dob: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (registerData.password !== registerData.confirm_password) {
            alert('Passwords do not match');
            return;
        }
        try {
            await axios.post('http://127.0.0.1:8000/register/', registerData);
            alert('Registration successful');
            // Actions after successful registration
        } catch (error) {
            alert('Registration failed');
        }
    }

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6 mt-5">
                <img src={userlogo} alt="User Reviews" className="logo"/>
                    <div className="card">
                        <div className="card-header">
                            REGISTER
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">First Name</label>
                                    <input type="text" name="first_name" className="form-control" placeholder="First Name" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Last Name</label>
                                    <input type="text" name="last_name" className="form-control" placeholder="Last Name" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-control" placeholder="Email" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Date of Birth</label>
                                    <input type="date" name="dob" className="form-control" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input type="password" name="password" className="form-control" placeholder="Password" onChange={handleChange} />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="password" name="confirm_password" className="form-control" placeholder="Confirm Password" onChange={handleChange} />
                                </div>
                                <div className="button-group">
                                    <button type="button" className="btn" onClick={handleCancel}>Cancel</button>
                                    <button type="submit" className="btn">Register</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register;


import React, { useState } from 'react';
import './ChronosAuth.css'; // import CSS-ul separat

const ChronosAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        companyName: '',
        role: 'employee'
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            console.log('Login:', { email: formData.email, password: formData.password });
            alert('Login functionality - to be implemented');
        } else {
            console.log('Register:', formData);
            alert('Register functionality - to be implemented');
        }
    };

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            firstName: '',
            lastName: '',
            companyName: '',
            role: 'employee'
        });
    };

    return (
        <div className="chronos-container">
            <div className="chronos-wrapper">
                <div className="chronos-header">
                    <h1 className="chronos-title">Chronos</h1>
                    <p className="chronos-subtitle">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </p>
                </div>

                <div className="chronos-card">
                    <h2 className="chronos-form-title">
                        {isLogin ? 'Login' : 'Register'}
                    </h2>

                    <div className="chronos-form">
                        {!isLogin && (
                            <>
                                <div className="chronos-row">
                                    <div className="chronos-field">
                                        <label htmlFor="firstName">First Name</label>
                                        <input
                                            type="text"
                                            id="firstName"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="chronos-field">
                                        <label htmlFor="lastName">Last Name</label>
                                        <input
                                            type="text"
                                            id="lastName"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="chronos-field">
                                    <label htmlFor="companyName">Company Name</label>
                                    <input
                                        type="text"
                                        id="companyName"
                                        name="companyName"
                                        value={formData.companyName}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div className="chronos-field">
                                    <label htmlFor="role">Role</label>
                                    <select
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    >
                                        <option value="employee">Employee</option>
                                        <option value="admin">Administrator</option>
                                        <option value="superadmin">Super Admin</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="chronos-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="chronos-field">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="••••••••"
                            />
                        </div>

                        {!isLogin && (
                            <div className="chronos-field">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="chronos-remember">
                                <label className="chronos-checkbox">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                                <button
                                    onClick={() => alert('Forgot password - to be implemented')}
                                    className="chronos-forgot"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            className="chronos-submit"
                        >
                            {isLogin ? 'Login' : 'Create Account'}
                        </button>
                    </div>

                    <div className="chronos-toggle">
                        <p>
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button onClick={toggleForm} className="chronos-toggle-btn">
                                {isLogin ? 'Register' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>

                <p className="chronos-footer">
                    © 2024 Chronos. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default ChronosAuth;

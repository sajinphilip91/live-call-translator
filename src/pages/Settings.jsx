import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, Layout, Battery, Info, ChevronRight } from 'lucide-react';
import './Settings.css';

const Settings = () => {
    const navigate = useNavigate();

    return (
        <div className="settings-container animate-fade-in">
            <div className="settings-header">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    <ArrowLeft size={24} />
                </button>
                <h1 className="settings-title">Settings</h1>
            </div>

            <div className="settings-list">
                <div className="settings-section">
                    <span className="section-title">Appearance</span>
                    <div className="settings-item">
                        <div className="item-left">
                            <Type size={20} className="item-icon" />
                            <span className="item-label">Text Size</span>
                        </div>
                        <span className="item-value">Medium</span>
                    </div>
                    <div className="settings-item">
                        <div className="item-left">
                            <Layout size={20} className="item-icon" />
                            <span className="item-label">Reset Overlay Position</span>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <span className="section-title">Performance</span>
                    <div className="warning-box">
                        <Battery size={20} className="warning-icon" />
                        <div className="warning-text">
                            <h4>Battery Optimization</h4>
                            <p>Disable battery optimization for this app to ensure uninterrupted translation during long calls.</p>
                        </div>
                    </div>
                </div>

                <div className="settings-section">
                    <span className="section-title">About</span>
                    <div className="settings-item">
                        <div className="item-left">
                            <Info size={20} className="item-icon" />
                            <span className="item-label">Version</span>
                        </div>
                        <span className="item-value">1.0.0</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;

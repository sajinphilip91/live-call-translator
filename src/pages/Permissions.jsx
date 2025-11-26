import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Layers, Accessibility, Check } from 'lucide-react';
import './Permissions.css';

const Permissions = () => {
    const navigate = useNavigate();
    const [permissions, setPermissions] = useState({
        microphone: false,
        accessibility: false,
        overlay: false
    });

    const togglePermission = (key) => {
        setPermissions(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const allGranted = Object.values(permissions).every(Boolean);

    const handleContinue = () => {
        if (allGranted) {
            navigate('/home');
        }
    };

    return (
        <div className="permissions-container animate-fade-in">
            <div className="permissions-header">
                <h1 className="permissions-title">Required Permissions</h1>
                <p className="permissions-desc">
                    To translate calls in real-time, the app needs access to the following services.
                </p>
            </div>

            <div className="permissions-list">
                <div
                    className={`permission-item ${permissions.microphone ? 'active' : ''}`}
                    onClick={() => togglePermission('microphone')}
                >
                    <div className="permission-info">
                        <div className="permission-icon">
                            <Mic size={20} />
                        </div>
                        <div className="permission-text">
                            <h3>Microphone</h3>
                            <p>To capture and translate speech</p>
                        </div>
                    </div>
                    <div className={`permission-status ${permissions.microphone ? 'granted' : ''}`}>
                        {permissions.microphone && <Check size={14} strokeWidth={3} />}
                    </div>
                </div>

                <div
                    className={`permission-item ${permissions.accessibility ? 'active' : ''}`}
                    onClick={() => togglePermission('accessibility')}
                >
                    <div className="permission-info">
                        <div className="permission-icon">
                            <Accessibility size={20} />
                        </div>
                        <div className="permission-text">
                            <h3>Accessibility</h3>
                            <p>To detect call status</p>
                        </div>
                    </div>
                    <div className={`permission-status ${permissions.accessibility ? 'granted' : ''}`}>
                        {permissions.accessibility && <Check size={14} strokeWidth={3} />}
                    </div>
                </div>

                <div
                    className={`permission-item ${permissions.overlay ? 'active' : ''}`}
                    onClick={() => togglePermission('overlay')}
                >
                    <div className="permission-info">
                        <div className="permission-icon">
                            <Layers size={20} />
                        </div>
                        <div className="permission-text">
                            <h3>Display Over Apps</h3>
                            <p>To show the translation overlay</p>
                        </div>
                    </div>
                    <div className={`permission-status ${permissions.overlay ? 'granted' : ''}`}>
                        {permissions.overlay && <Check size={14} strokeWidth={3} />}
                    </div>
                </div>
            </div>

            <button
                className={`btn-continue ${allGranted ? 'enabled' : ''}`}
                onClick={handleContinue}
            >
                Continue
            </button>
        </div>
    );
};

export default Permissions;

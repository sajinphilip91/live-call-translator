import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowRightLeft, Mic, PhoneOff } from 'lucide-react';
import Overlay from '../components/Overlay';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [isTranslating, setIsTranslating] = useState(false);
    const [autoDetect, setAutoDetect] = useState(true);
    const [voiceTranslation, setVoiceTranslation] = useState(false);
    const [langDirection, setLangDirection] = useState({ from: 'Hindi', to: 'English' });

    const handleSwapLanguages = () => {
        setLangDirection(prev => ({ from: prev.to, to: prev.from }));
    };

    const toggleTranslation = () => {
        setIsTranslating(!isTranslating);
    };

    return (
        <div className="home-container animate-fade-in">
            {/* Simulation Background & Overlay */}
            {isTranslating && (
                <div className="simulation-overlay">
                    <Overlay onClose={() => setIsTranslating(false)} />

                    <div className="simulation-controls">
                        <button className="sim-btn end" onClick={() => setIsTranslating(false)}>
                            <PhoneOff size={24} />
                        </button>
                    </div>
                </div>
            )}

            <div className="home-header">
                <h1 className="app-title">Live Call Translator</h1>
                <button className="settings-btn" onClick={() => navigate('/settings')}>
                    <SettingsIcon size={24} />
                </button>
            </div>

            <div className="home-content">
                <div className="language-selector">
                    <div className="lang-row">
                        <div className="lang-box">{langDirection.from}</div>
                        <button className="swap-btn" onClick={handleSwapLanguages}>
                            <ArrowRightLeft size={20} />
                        </button>
                        <div className="lang-box">{langDirection.to}</div>
                    </div>
                </div>

                <div className="options-container">
                    <div className="option-item">
                        <span className="option-label">Auto detect language</span>
                        <div
                            className={`toggle-switch ${autoDetect ? 'active' : ''}`}
                            onClick={() => setAutoDetect(!autoDetect)}
                        >
                            <div className="toggle-thumb" />
                        </div>
                    </div>

                    <div className="option-item">
                        <span className="option-label">Voice Translation (TTS)</span>
                        <div
                            className={`toggle-switch ${voiceTranslation ? 'active' : ''}`}
                            onClick={() => setVoiceTranslation(!voiceTranslation)}
                        >
                            <div className="toggle-thumb" />
                        </div>
                    </div>
                </div>

                <div className="start-btn-container">
                    <button className="btn-start" onClick={toggleTranslation}>
                        <Mic size={24} />
                        Start Translator
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;

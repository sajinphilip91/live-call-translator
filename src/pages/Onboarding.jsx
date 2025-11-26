import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, Video, Languages, ArrowRight } from 'lucide-react';
import './Onboarding.css';

const slides = [
    {
        id: 1,
        icon: <PhoneCall size={48} />,
        title: "Translate Any Call Instantly",
        desc: "Real-time speech translation for phone and WhatsApp calls."
    },
    {
        id: 2,
        icon: <Video size={48} />,
        title: "Works on WhatsApp Audio & Video",
        desc: "Seamlessly integrates with your favorite calling apps."
    },
    {
        id: 3,
        icon: <Languages size={48} />,
        title: "Hindi ↔ English Real-time",
        desc: "Break language barriers with instant bidirectional translation."
    }
];

const Onboarding = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            navigate('/permissions');
        }
    };

    const handleSkip = () => {
        navigate('/permissions');
    };

    return (
        <div className="onboarding-container animate-fade-in">
            <div className="slides-container">
                <div className="slide-icon">
                    {slides[currentSlide].icon}
                </div>
                <h1 className="slide-title">{slides[currentSlide].title}</h1>
                <p className="slide-desc">{slides[currentSlide].desc}</p>
            </div>

            <div>
                <div className="dots-container">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                        />
                    ))}
                </div>

                <div className="actions-container">
                    <button className="btn-primary flex-center" onClick={handleNext}>
                        {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                        {currentSlide !== slides.length - 1 && <ArrowRight size={20} style={{ marginLeft: 8 }} />}
                    </button>
                    <button className="btn-text" onClick={handleSkip}>
                        Skip
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;

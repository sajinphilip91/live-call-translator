import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Play, X, Minimize2, Maximize2 } from 'lucide-react';
import './Overlay.css';

const MOCK_TRANSCRIPTS = [
    { id: 1, original: "नमस्ते, आप कैसे हैं?", translated: "Hello, how are you?", isUser: false },
    { id: 2, original: "I am good, thank you.", translated: "मैं ठीक हूँ, धन्यवाद।", isUser: true },
    { id: 3, original: "क्या हम प्रोजेक्ट पर चर्चा कर सकते हैं?", translated: "Can we discuss the project?", isUser: false },
    { id: 4, original: "Yes, let's start now.", translated: "हाँ, चलिए अभी शुरू करते हैं।", isUser: true },
    { id: 5, original: "मुझे लगता है कि डिज़ाइन अच्छा है।", translated: "I think the design is good.", isUser: false },
];

const Overlay = ({ onClose }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [mockIndex, setMockIndex] = useState(0);
    const contentRef = useRef(null);

    // Simulate live transcription
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            if (mockIndex < MOCK_TRANSCRIPTS.length) {
                setTranscripts(prev => [...prev, MOCK_TRANSCRIPTS[mockIndex]]);
                setMockIndex(prev => (prev + 1) % MOCK_TRANSCRIPTS.length); // Loop for demo
            }
        }, 2500);

        return () => clearInterval(interval);
    }, [mockIndex, isPaused]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [transcripts, isExpanded]);

    if (!isExpanded) {
        return (
            <div className="overlay-container" style={{ top: '150px', right: '20px' }}>
                <div className="overlay-bubble" onClick={() => setIsExpanded(true)}>
                    <Mic size={24} />
                </div>
            </div>
        );
    }

    return (
        <div className="overlay-container" style={{ top: '100px', right: '20px' }}>
            <div className="overlay-expanded animate-fade-in">
                <div className="overlay-header">
                    <div className="overlay-status">
                        <div className="status-dot" />
                        <span>Translating...</span>
                    </div>
                    <div className="overlay-actions">
                        <div className="action-icon" onClick={() => setIsPaused(!isPaused)}>
                            {isPaused ? <Play size={16} /> : <Pause size={16} />}
                        </div>
                        <div className="action-icon" onClick={() => setIsExpanded(false)}>
                            <Minimize2 size={16} />
                        </div>
                        <div className="action-icon" onClick={onClose}>
                            <X size={16} />
                        </div>
                    </div>
                </div>

                <div className="overlay-content" ref={contentRef}>
                    {transcripts.length === 0 && (
                        <div style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
                            Listening for speech...
                        </div>
                    )}
                    {transcripts.map((t, idx) => (
                        <div key={`${t.id}-${idx}`} className={`transcript-line ${t.isUser ? 'user' : ''}`}>
                            <span className="original-text">{t.original}</span>
                            {t.translated}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overlay;

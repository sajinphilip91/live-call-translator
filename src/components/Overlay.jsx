import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Play, X, Minimize2 } from 'lucide-react';
import './Overlay.css';

const Overlay = ({ onClose, inputLang = 'en-US' }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const contentRef = useRef(null);
    const recognitionRef = useRef(null);

    // Translation function that handles romanized Hindi
    const translateText = async (text, lang) => {
        try {
            if (lang === 'en-US') {
                // English -> Hindi using Google Translate API (via cors-anywhere proxy)
                const response = await fetch(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=hi&dt=t&q=${encodeURIComponent(text)}`
                );
                const data = await response.json();
                return data[0][0][0] || text;
            } else {
                // For Hindi input (which comes as romanized text from speech recognition)
                // We need to translate romanized Hindi -> English
                // Using Google Translate which handles romanized input well
                const response = await fetch(
                    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodeURIComponent(text)}`
                );
                const data = await response.json();
                return data[0][0][0] || text;
            }
        } catch (error) {
            console.error('Translation error:', error);
            return `[Translation error]`;
        }
    };

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = inputLang;

            recognition.onresult = async (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                const isFinal = event.results[current].isFinal;

                if (isFinal) {
                    // Show "Translating..." placeholder first
                    const tempId = Date.now();
                    setTranscripts(prev => [
                        ...prev,
                        {
                            id: tempId,
                            original: transcript,
                            translated: 'Translating...',
                            isUser: true
                        }
                    ]);

                    // Get actual translation
                    const translation = await translateText(transcript, inputLang);

                    // Update with real translation
                    setTranscripts(prev =>
                        prev.map(t =>
                            t.id === tempId ? { ...t, translated: translation } : t
                        )
                    );
                }
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
            };

            recognitionRef.current = recognition;
        } else {
            console.warn("Browser does not support Speech Recognition");
            setTranscripts([{ id: 0, original: "Error", translated: "Browser not supported", isUser: false }]);
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, [inputLang]); // Re-run if language changes

    // Handle Start/Stop based on Pause state
    useEffect(() => {
        if (!recognitionRef.current) return;

        if (isPaused) {
            recognitionRef.current.stop();
        } else {
            try {
                recognitionRef.current.start();
            } catch (e) {
                // Ignore error if already started
            }
        }
    }, [isPaused]);

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
                        <div className={`status-dot ${isPaused ? 'paused' : ''}`} />
                        <span>{isPaused ? 'Paused' : `Listening (${inputLang === 'hi-IN' ? 'Hindi' : 'English'})...`}</span>
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
                        <div style={{ textAlign: 'center', color: '#999', padding: '20px', fontSize: '14px' }}>
                            {isPaused ? 'Translation paused' : `Speak ${inputLang === 'hi-IN' ? 'Hindi' : 'English'} now...`}
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

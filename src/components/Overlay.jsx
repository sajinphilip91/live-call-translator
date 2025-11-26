import React, { useState, useEffect, useRef } from 'react';
import { Mic, Pause, Play, X, Minimize2 } from 'lucide-react';
import './Overlay.css';

const Overlay = ({ onClose, inputLang = 'en-US' }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const contentRef = useRef(null);
    const recognitionRef = useRef(null);

    // Simple Mock Dictionary for Demo
    const translateText = (text, lang) => {
        if (lang === 'en-US') return "अनुवाद: " + text; // English -> Hindi (Mock)

        // Hindi -> English Dictionary
        const dictionary = {
            "तुम्हारा नाम क्या है": "What is your name?",
            "तुमारा नाम क्या है": "What is your name?", // Common misspellings/variations
            "आपका नाम क्या है": "What is your name?",
            "नमस्ते": "Hello",
            "आप कैसे हैं": "How are you?",
            "मैं ठीक हूँ": "I am fine",
            "धन्यवाद": "Thank you",
            "हाँ": "Yes",
            "नहीं": "No",
            "चलो": "Let's go",
            "क्या हो रहा है": "What is happening?",
            "सुप्रभात": "Good morning",
            "शुभ रात्रि": "Good night"
        };

        // Check for exact match or partial match
        for (const [hindi, english] of Object.entries(dictionary)) {
            if (text.includes(hindi)) {
                return english;
            }
        }

        // Fallback for unknown words
        return `[Translating: ${text}...]`;
    };

    useEffect(() => {
        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = inputLang;

            recognition.onresult = (event) => {
                const current = event.resultIndex;
                const transcript = event.results[current][0].transcript;
                const isFinal = event.results[current].isFinal;

                if (isFinal) {
                    const translation = translateText(transcript, inputLang);

                    setTranscripts(prev => [
                        ...prev,
                        {
                            id: Date.now(),
                            original: transcript,
                            translated: translation,
                            isUser: true
                        }
                    ]);
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

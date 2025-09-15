'use client';
import React, { useState, useRef, useEffect } from "react";


function HomePage() {
    const [textAreaValue, setTextAreaValue] = useState('Terry\nNancy\nDennis\nDerek\nJohn\nAnton\nMitch\nSteve\nDiane\nAli\nRumilung\nMadhavi\nYuanhong\n');
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState("Sorting Hat");
    const [wheelBackground, setWheelBackground] = useState('');
    const [transform, setTransform] = useState('rotate(0deg)');
    const [spinning, setSpinning] = useState(false);
    const [activeTab, setActiveTab] = useState("contestants");
    const spinCount = useRef(0);

    const segmentColors = [
        '#FF6B6B', '#FFD166', '#CCCCFF', '#06D6A0', '#118AB2', '#073B4C', '#A8DADC', '#F4A261', '#E76F51',
        '#2A9D8F', '#264653', '#F4F1DE', '#E07A5F',
    ];

    // Effect to parse textarea value into options
    useEffect(() => {
        const names = textAreaValue.split('\n').map(name => name.trim()).filter(name => name !== '');
        setOptions(names);
    }, [textAreaValue]);

    useEffect(() => {
        if (options.length > 0) {
            const degreePerOption = 360/options.length;

            // Start the conic gradient explicitly from the top (0 degree).
            let conicGradientString = "conic-gradient(from 0deg, ";
            let currentDegree = 0;
            options.forEach((_, index) => {
                const color = segmentColors[index % segmentColors.length];
                conicGradientString += `${color} ${currentDegree}deg, ${color} ${currentDegree + degreePerOption}deg, `;
                currentDegree += degreePerOption; 
            });

            conicGradientString = conicGradientString.slice(0, -2) + ')';
            setWheelBackground(conicGradientString);
            console.log(`conicGradientString: ${conicGradientString}`);
        } else {
            setWheelBackground('conic-gradient(from 0deg, #A8DADC 0deg, #A8DADC 360deg');
        }
    }, [options]);


    const handleSpin = async () => {
        if (spinning || options.length === 0) {
          return;
        }
    
        setSpinning(true);
        
        // Reset transform to ensure the animation is triggered every time
        setTransform('rotate(0deg)');
    
        const randomIndex = Math.floor(Math.random() * options.length);
        const degreePerOption = 360 / options.length;
        
        spinCount.current += 10; // Increment spin count for a fresh rotation
        const segmentCenterDegree = randomIndex * degreePerOption + degreePerOption / 2;
        const finalDegree = (360 * spinCount.current) + (90 - segmentCenterDegree);
    
        setTransform(`rotate(${finalDegree}deg)`);
    
        setTimeout(() => {
          setSpinning(false);
    
          setTimeout(() => {
            const remainingOptions = options.filter((_, index) => index !== randomIndex);
            setTextAreaValue(remainingOptions.join('\n'));
          }, 3000);
        }, 4100); // 4.1 seconds to account for the 4s transition
      };

    const getTextStyles = (index) => {
        const degreePerOption = 360 / options.length;

        // Calculate the degree for the text, then subtract 90 to align with the wheel's top-down layout
        const rotateDegree = (index * degreePerOption) + (degreePerOption / 2) - 90;
        
        return {
            transform: `rotate(${rotateDegree}deg) translateX(6.5rem)`,
        };
    };


    return (
        <div className="flex flex-col items-center justify-center min-h-screen app-container">
            <style>
            {
                `.app-container {
                    background-color: #f1f5f9;
                    color: # #1a202c;
                    padding: 1rem;
                    font-family: sans-serif;
                    gap: 2rem;
                    width: 100%;
                }
                .wheel-container {
                    position: relative;
                    width: 28rem;
                    height: 28rem;
                    cursor: pointer;
                    margin: 2rem;
                }
                .wheel {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    border-radius: 9999px;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    transition: transform 4s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .option-text {
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform-origin: 0 0;
                    color: white;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
                }
                .center-circle {
                    position: absolute;
                    width: 8rem;
                    height: 8rem;
                    background-color: #ffffff;
                    border-radius: 9999px;
                    inset: 0;
                    margin: auto;
                    box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
                    pointer-events: none;
                }
                .pointer {
                    position: absolute;
                    top: 50%;
                    right: -20px;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-top: 15px solid transparent;
                    border-bottom: 15px solid transparent;
                    border-right: 30px solid #f59e0b;
                    z-index: 10;
                }
                .spin-button {
                    background-color: #f59e0b;
                    color: #1f2937;
                    font-weight: 700;
                    padding: 1rem 2.5rem;
                    border-radius: 1rem;
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    transition: background-color 0.2s;
                    font-size: 1.25rem;
                }

                .spin-button:hover {
                    background-color: #fcd34d;
                }

                .spin-button:disabled {
                    background-color: #4b5563;
                    cursor: not-allowed;
                }

                .tab-panel {
                    background-color: #ffffff;
                    padding: 1.5rem;
                    border-radius: 1rem;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 24rem;
                }

                .tab-buttons {
                    display: flex;
                    justify-content: space-around;
                    margin-bottom: 0.5rem;
                    border-bottom: 2px solid #e5e7eb;
                }

                .tab-button {
                    flex-grow: 1;
                    padding: 0.75rem;
                    text-align: center;
                    font-weight: 600;
                    color: #6b7280;
                    cursor: pointer;
                    transition: color 0.2s, border-bottom-color 0.2s;
                    border-bottom: 2px solid transparent;
                }

                .tab-button.active {
                    color: #f59e0b;
                    border-bottom-color: #f59e0b;
                }

                .tab-button:hover {
                    color: #f59e0b;
                }
                
                `
            }
            </style>
            <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">{title}</h1>
            <div className="flex flex-col lg:flex-row lg:items-center justify-center w-full gap-8">
                <div className="flex flex-col items-center w-full lg:w-3/4">
                    <div className="wheel-container" onClick={handleSpin}>
                        <div className="wheel" style={{ transform, background: wheelBackground }}>
                            {options.map((option, index) => (
                                <div 
                                    key={index}
                                    className="option-text"
                                    style={getTextStyles(index)}
                                >
                                    <span>{option}</span>
                                </div>
                            ))}
                            <div className="center-circle"></div>
                        </div>
                        <div className="pointer"></div>
                    </div>
                    <div className="text-center mt-4">
                        <button
                            onClick={handleSpin}
                            disabled={spinning || options.length == 0}
                            className="spin-button"
                        >
                            {spinning ? "Spinning..." : "Spin"}
                        </button>
                    </div>

                </div>
                <div className="flex flex-col items-center lg:items-start w-full lg:w-1/4 mt-8 lg:mt-0">
                    <div className="tab-panel">
                        <div className="tab-buttons">
                            <button
                                className={`tab-button ${activeTab === "contestants" ? "active" : ''}`}
                                onClick={() => setActiveTab("contestants")}
                            >
                                Contestants
                            </button>
                            <button
                                className={`tab-button ${activeTab === "sound" ? "active" : ''}`}
                                onClick={() => setActiveTab("sound")}
                            >
                                Sound
                            </button>
                            <button
                                className={`tab-button ${activeTab === "order" ? "active" : ''}`}
                                onClick={() => setActiveTab("order")}
                            >
                                Order
                            </button>

                        </div>
                        <div className="tab-content">
                            {
                                activeTab === "contestants" && (
                                    <div className="mb-4">
                                        <label htmlFor="options-textarea" className="block text-sm font-medium text-gray-700 mb-1">
                                            Enter a list of names (one per line):
                                        </label>
                                        <textarea
                                            id="options-textarea"
                                            value={textAreaValue}
                                            onChange={(e) => setTextAreaValue(e.target.value)}
                                            rows="8"
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus-ring-yellow-500"
                                            placeholder="Enter a contestant name per line..."

                                        />
                                    </div>
                                )
                            }
                        </div>

                    </div>
                </div>

            </div>
        
        </div>
    );
};

export default HomePage;

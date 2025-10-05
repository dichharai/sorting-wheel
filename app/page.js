"use client";

import Image from "next/image";
import shuffleIcon from "../public/images/shuffle.svg";
import sortIcon from "../public/images/sort.svg";
import eraserIcon from "../public/images/eraser.svg";
import React, { useState, useRef, useEffect, useCallback } from "react";

function HomePage() {
  const [textAreaValue, setTextAreaValue] = useState(
    "Terry\nNancy\nDennis\nDerek\nRumilung\n",
  );

  const [options, setOptions] = useState([]);
  const [wheelBackground, setWheelBackground] = useState("");
  const [transform, setTransform] = useState("rotate(0deg)");
  const [spinning, setSpinning] = useState(false);
  const [activeTab, setActiveTab] = useState("contestants");
  const [pastOrders, setPastOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [ascSort, setAscSort] = useState(false);
  const [showPickedContestantBox, setShowPickedContestantBox] = useState(false);
  const [pickedContestant, setPickedContestant] = useState(null);
  const [Tone, setTone] = useState(null);
  const [soundOn, setSoundOn] = useState(true);

  const spinCount = useRef(0);
  const confettiRef = useRef(null);

  const TITLE = "Sorting Wheel";
  const MAX_CONTESTANT_ENTRY = 15;

  // Dynamically import the canvas-confetti library
  useEffect(() => {
    import("canvas-confetti").then((confetti) => {
      confettiRef.current = confetti.default;
    });
  }, []);

  // Dynamically import tone library
  useEffect(() => {
    import("tone").then((module) => {
      setTone(module);
    });
  }, []);

  // Effect to parse textarea value into options
  useEffect(() => {
    const names = textAreaValue
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");
    setOptions(names);
  }, [textAreaValue]);

  useEffect(() => {
    const SEGMENT_COLORS = [
      "#6600FF", // electric indigo
      "#228B22", // forest green
      "#DA3287", // deep cerise
      "#0F52BA", // sapphire
      "#FF8C00", // marigold
      "#0038A8", // royal blue
      "#FF5E00", // bright orange
      "#FF69B4", // hot pink
      "#FF2400", // scarlet red
      "#40E0D0", // turquoise
      "#E0115F", // ruby red
      "#CCFF00", // neon green
      "#E25822", // flame
      "#FFD700", // gold
      "#008080", // teal
    ];
    if (options.length > 0) {
      const degreePerOption = 360 / options.length;

      // Start the conic gradient explicitly from the top (0 degree).
      let conicGradientString = "conic-gradient(from 0deg, ";
      let currentDegree = 0;
      options.forEach((_, index) => {
        const color = SEGMENT_COLORS[index % SEGMENT_COLORS.length];

        conicGradientString += `${color} ${currentDegree}deg, ${color} ${currentDegree + degreePerOption}deg, `;
        currentDegree += degreePerOption;
      });

      conicGradientString = conicGradientString.slice(0, -2) + ")";
      setWheelBackground(conicGradientString);
    } else {
      setWheelBackground(
        "conic-gradient(from 0deg, #A8DADC 0deg, #A8DADC 360deg",
      );
    }
  }, [options]);

  const startAudioContext = useCallback(async () => {
    if (!Tone) {
      console.log("tone js package is not loaded");
      return false;
    }
    if (Tone.getContext().state !== "running") {
      try {
        await Tone.start();
        return true;
      } catch (error) {
        console.log(`Failed to start tone.js Audio Context. error: ${error}`);
        return false;
      }
    } else {
      return true;
    }
  }, [Tone]);

  const playApplause = useCallback(() => {
    if (!Tone) {
      console.log("no tone js library");
      return;
    }
    Tone.getContext()
      .resume()
      .then(() => {
        // 1. Create a synth (PolySynth for a fuller sound)
        const synth = new Tone.PolySynth(Tone.AMSynth, {
          oscillator: { type: "triangle" },
        }).toDestination();

        //2. Play C Major chord for 1 second
        const now = Tone.now();

        // Set to default BPM
        Tone.getTransport().bpm.value = 120;

        //3. play the sound
        synth.triggerAttackRelease(["C4", "E4", "G4"], "1n", now);

        //4. Schedule the synth to be cleaned up after the note finishes
        Tone.getTransport().scheduleOnce(() => {
          synth.dispose(); // Removes the synth from the audio graph
        }, now + 1.5);
      });
  }, [Tone]);

  const startSpinningSound = async () => {
    if (!Tone) {
      return;
    }

    // 1. Setup a synth
    const clickSynth = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.04, sustain: 0.0, release: 1.5 },
    }).toDestination();

    // 2. Setup looping event
    const clickLoop = new Tone.Loop((time) => {
      // trigger to play for the duration of "16n" (sixteenth note)
      clickSynth.triggerAttackRelease("16n", time);
    }, "16n").start(0);

    // // Set the initial BPM
    const BPM = 120;
    const RAMP_TIME = 3;
    const NEW_BPM = 60;

    const now = Tone.now();
    // start the Transport (global clock)
    Tone.getTransport().start();
    // set the default BMP value
    Tone.getTransport().bpm.value = BPM;

    // 3. change the bmp to new value schedule now
    Tone.getTransport().schedule((time) => {
      Tone.getTransport().bpm.rampTo(NEW_BPM, RAMP_TIME, time);
    }, now);

    // 4. schedule the Stop Event after 3s
    Tone.getTransport().scheduleOnce((time) => {
      Tone.getTransport().stop(time);
      clickSynth.dispose();
      clickLoop.dispose();
    }, 3);
  };

  const handleSpin = async () => {
    if (spinning || options.length === 0) {
      return;
    }

    setSpinning(true);
    setShowPickedContestantBox(false);
    setPickedContestant(null);

    const audioStarted = await startAudioContext();

    if (soundOn && audioStarted) {
      Tone.getContext()
        .resume()
        .then(() => {
          startSpinningSound();
        });
    } else {
      console.log("sound type not selected or audio context not started.");
    }

    // Reset transform to ensure the animation is triggered every time
    setTransform("rotate(0deg)");

    const randomIndex = Math.floor(Math.random() * options.length);
    const degreePerOption = 360 / options.length;

    spinCount.current += 4; // Increment spin count for a fresh rotation
    const segmentCenterDegree =
      randomIndex * degreePerOption + degreePerOption / 2;
    const finalDegree = 360 * spinCount.current + (90 - segmentCenterDegree);

    setTransform(`rotate(${finalDegree}deg)`);

    setTimeout(async () => {
      setSpinning(false);
      const contestantName = options[randomIndex];
      setOrderCount((orderCount) => orderCount + 1);
      setPickedContestant(contestantName);
      setPastOrders((prevOrders) => [
        ...prevOrders,
        { number: orderCount + 1, name: contestantName },
      ]);

      if (confettiRef.current) {
        fireConfetti();
      }

      if (audioStarted) {
        playApplause();
      } else {
        console.log(`audio has not started: ${Tone.getContext().state}`);
      }

      setShowPickedContestantBox(true);

      setTimeout(() => {
        const remainingOptions = options.filter(
          (_, index) => index !== randomIndex,
        );
        setTextAreaValue(remainingOptions.join("\n"));
        setShowPickedContestantBox(false);
      }, 4000);
    }, 6100); // 6.1 seconds to account for the 6s transition
  };

  const getTextStyles = (index) => {
    const degreePerOption = 360 / options.length;

    // Calculate the degree for the text, then subtract 90 to align with the wheel's top-down layout
    // Subtracting 5 for alinging to center of segment
    const rotateDegree = index * degreePerOption + degreePerOption / 2 - 90 - 5;

    return {
      transform: `rotate(${rotateDegree}deg) translateX(6.5rem)`,
    };
  };

  const handleShuffleEntries = () => {
    const shuffledOptions = [...options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [
        shuffledOptions[j],
        shuffledOptions[i],
      ];
    }
    setTextAreaValue(shuffledOptions.join("\n"));
  };

  const sortEntries = () => {
    return [...options].sort((a, b) => a.localeCompare(b));
  };

  const handleSortEntries = () => {
    let sortedOptions;
    if (!ascSort) {
      sortedOptions = sortEntries();
    } else {
      sortedOptions = sortEntries().reverse();
    }
    setTextAreaValue(sortedOptions.join("\n"));
    setAscSort(!ascSort);
  };

  const handleClearEntries = () => {
    if (textAreaValue.length < 1) {
      return;
    }
    setTextAreaValue("");
  };

  const handleClearPastOrders = () => {
    if (pastOrders.length < 1) {
      return;
    }
    setPastOrders([]);
    setOrderCount(0);
  };

  const handleSoundToggle = () => {
    setSoundOn(!soundOn);
  };

  const handleDownloadOrders = () => {
    if (pastOrders.length === 0) {
      return;
    }
    const header = "Number,Name\n";
    const csvContent =
      header + pastOrders.map((o) => `${o.number},"${o.name}"`).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "contestantOrders.csv");
    link.click();
    document.body.appendChild(link);
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const fireConfetti = () => {
    if (confettiRef.current) {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confettiRef.current({
          particleCount: 5,
          angle: 50,
          origin: { x: 0, y: 1 },
          startVelocity: 70,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen app-container">
      <h1 className="text-4xl font-bold mb-6 text-center text-yellow-500">
        {TITLE}
      </h1>
      <div className="flex flex-col lg:flex-row lg:items-center justify-center w-full gap-8">
        <div className="flex flex-col items-center w-full lg:w-3/4">
          <div className="wheel-container" onClick={handleSpin}>
            <div
              className="wheel"
              style={{ transform, background: wheelBackground }}
            >
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
          <div className="tab-panel max-h-105 min-h-105 flex flex-col">
            <div className="tab-buttons">
              <button
                className={`tab-button ${activeTab === "contestants" ? "active" : ""}`}
                onClick={() => setActiveTab("contestants")}
              >
                Contestants
              </button>
              <button
                className={`tab-button ${activeTab === "sound" ? "active" : ""}`}
                onClick={() => setActiveTab("sound")}
              >
                Sound
              </button>
              <button
                className={`tab-button ${activeTab === "order" ? "active" : ""}`}
                onClick={() => setActiveTab("order")}
              >
                Order
              </button>
            </div>
            <div className="tab-content flex flex-col overflow-y-auto px-1">
              {activeTab === "contestants" && (
                <div className="mb-4 overflow-y-auto">
                  <div className="action-button-group">
                    <button
                      onClick={handleShuffleEntries}
                      disabled={options.length <= 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={shuffleIcon} alt="shuffle icon" />
                      Shuffle
                    </button>
                    <button
                      onClick={handleSortEntries}
                      disabled={options.length <= 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={sortIcon} alt="sort icon" />
                      Sort
                    </button>
                    <button
                      onClick={handleClearEntries}
                      disabled={options.length < 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={eraserIcon} alt="eraser icon" />
                      Clear
                    </button>
                  </div>
                  <label
                    htmlFor="options-textarea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Enter a list of names (one per line, max{" "}
                    {MAX_CONTESTANT_ENTRY}):
                  </label>
                  <textarea
                    id="options-textarea"
                    value={textAreaValue}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      const values = newValue.split("\n");
                      if (values.length > MAX_CONTESTANT_ENTRY) {
                        const truncatedValue = values
                          .slice(0, MAX_CONTESTANT_ENTRY)
                          .join("\n");
                        setTextAreaValue(truncatedValue);
                      } else {
                        setTextAreaValue(newValue);
                      }
                    }}
                    rows="8"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    placeholder="Enter a contestant name per line..."
                  />
                </div>
              )}
              {activeTab === "sound" && (
                <div className="sound-options-container p-2">
                  <button
                    id="sound-toggle"
                    role="switch"
                    aria-checked={soundOn}
                    onClick={handleSoundToggle}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 foucs:ring-offset-gray-600 ${soundOn ? "bg-yellow-500" : "bg-gray-500"} `}
                  >
                    <span
                      aria-hidden="true"
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition duration-200 ease-in-out ${soundOn ? "translate-x-7" : "translate-x-1"}`}
                    />
                  </button>
                  <label
                    htmlFor="sound-toggle"
                    className={`text-lg font-medium transition-colors duration-200 ${soundOn ? "text-yellow-600" : "text-gray-600"}`}
                  >
                    {" "}
                    Sound
                  </label>
                </div>
              )}
              {activeTab === "order" && (
                <>
                  <div className="action-button-group">
                    <button
                      onClick={handleClearPastOrders}
                      disabled={pastOrders.length < 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={eraserIcon} alt="eraser icon" />
                      Clear
                    </button>
                  </div>
                  <hr className="border-gray-300" />
                  {pastOrders.length > 0 ? (
                    <div className="flex-grow overflow-y-auto mb-4">
                      <ul className="orders-list">
                        {pastOrders.map((order) => (
                          <li key={order.number} className="order-entry">
                            <span>#{order.number} </span>
                            <span className="font-semibold">{order.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 my-4 flex-grow flex items-center justify-center">
                      <p>No past contestant orders to display.</p>
                    </div>
                  )}

                  <button
                    onClick={handleDownloadOrders}
                    className="w-full download-button py-2 px-4 rounded-lg bg-yellow-500 text-white font-semibold hove:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
                    disabled={pastOrders.length === 0}
                  >
                    Download
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {showPickedContestantBox && (
        <div className="picked-contestant-modal-overlay">
          <div className="picked-contestant-modal">
            <h2>#{orderCount}</h2>
            <p>{pickedContestant}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;

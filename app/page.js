"use client";

import Image from "next/image";
import shuffleIcon from "../public/images/shuffle.svg";
import sortIcon from "../public/images/sort.svg";
import deleteIcon from "../public/images/delete.svg";
import React, { useState, useRef, useEffect } from "react";

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

  const spinCount = useRef(0);
  const confettiRef = useRef(null);

  const TITLE = "Sorting Hat";

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

  // Effect to parse textarea value into options
  useEffect(() => {
    const names = textAreaValue
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");
    setOptions(names);
  }, [textAreaValue]);

  useEffect(() => {
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

  // Dynamically import the canvas-confetti library
  useEffect(() => {
    import("canvas-confetti").then((confetti) => {
      confettiRef.current = confetti.default;
    });
  }, []);

  const handleSpin = async () => {
    if (spinning || options.length === 0) {
      return;
    }

    setSpinning(true);
    setShowPickedContestantBox(false);
    setPickedContestant(null);

    // Reset transform to ensure the animation is triggered every time
    setTransform("rotate(0deg)");

    const randomIndex = Math.floor(Math.random() * options.length);
    const degreePerOption = 360 / options.length;

    spinCount.current += 4; // Increment spin count for a fresh rotation
    const segmentCenterDegree =
      randomIndex * degreePerOption + degreePerOption / 2;
    const finalDegree = 360 * spinCount.current + (90 - segmentCenterDegree);

    setTransform(`rotate(${finalDegree}deg)`);

    setTimeout(() => {
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
    const rotateDegree = index * degreePerOption + degreePerOption / 2 - 90;

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

  const handleDeleteEntries = () => {
    if (textAreaValue.length < 1) {
      return;
    }
    setTextAreaValue("");
  };

  const handleDeletePastOrders = () => {
    if (pastOrders.length < 1) {
      return;
    }
    setPastOrders([]);
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
          particleCount: 3,
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
                      onClick={handleDeleteEntries}
                      disabled={options.length < 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={deleteIcon} alt="delete icon" />
                      Delete
                    </button>
                  </div>
                  <label
                    htmlFor="options-textarea"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
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
              )}
              {activeTab === "order" && (
                <>
                  <div className="action-button-group">
                    <button
                      onClick={handleDeletePastOrders}
                      disabled={pastOrders.length < 1}
                      className="action-button flex items-center gap-1"
                    >
                      <Image src={deleteIcon} alt="delete icon" />
                      Delete
                    </button>
                  </div>
                  <hr className="border-t border-gray-300" />
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

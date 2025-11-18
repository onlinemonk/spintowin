"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import "./popup.scss";

const prizes = [
  {
    label:
      "25% Off on next purchase i.e. Buy 3 get 1 Free. Any Bridgestone Tire",
    probability: 0.01,
    color: "#000000", // Red
    iconUrl: "/25OFF.svg",
  },
  {
    label: "10% off on next purchase on any Bridgestone Tire",
    probability: 0.14,
    color: "Red", // Blue
    iconUrl: "/10OFF.svg",
  },
  {
    label: "Free wheel alignment at Dial-a-Tire",
    probability: 0.07,
    color: "#757575", // Grey
    iconUrl: "/wheelalignment.svg",
  },
  {
    label: "Free merchandise - Cap",
    probability: 0.12,
    color: "#000000", // Red
    iconUrl: "/cap.svg",
  },
  {
    label: "Free merchandise - Bottle",
    probability: 0.16,
    color: "#e60012", // Blue
    iconUrl: "/Bottle.svg",
  },
  {
    label: "Free merchandise - Car Wireless Charger",
    probability: 0.25,
    color: "#757575", // Grey
    iconUrl: "/charger.svg",
  },
  {
    label: "Free merchandise - Bluetooth Speaker",
    probability: 0.25,
    color: "#e60012", // Blue
    iconUrl: "/BluethoothSpeaker.svg",
  },
];

export default function SpinToWinWheel() {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [resetting, setResetting] = useState(false);
  const animationRef = React.useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const prevSegmentRef = useRef<number | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      Promise.resolve().then(() => setShowPopup(true));
    }
  }, [selectedIndex]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    const rand = Math.random();
    let acc = 0;
    let prizeIndex = 0;
    for (let i = 0; i < prizes.length; i++) {
      acc += prizes[i].probability;
      if (rand < acc) {
        prizeIndex = i;
        break;
      }
    }
    // Use a time-based ease-out animation so the spin speed is predictable
    const extraSpins = 6; // fewer full revolutions but slower overall feel
    const segmentAngle = 360 / prizes.length;
    const targetRotation =
      360 * extraSpins +
      (360 - (prizeIndex * segmentAngle + segmentAngle / 2)) -
      90;

    // Cancel any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    const startRotation = rotation;
    const duration = 6000; // ms - total spin duration (6s)
    const startTimeRef = { current: 0 } as { current: number };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    function animate(timestamp: number) {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(progress);

      const current = startRotation + (targetRotation - startRotation) * eased;
      setRotation(current);

      // Play a tick when the wheel passes into a new segment
      try {
        const normalized = ((current % 360) + 360) % 360;
        const segment = Math.floor(normalized / segmentAngle);
        if (prevSegmentRef.current === null) {
          prevSegmentRef.current = segment;
        } else if (segment !== prevSegmentRef.current) {
          prevSegmentRef.current = segment;
          playTick();
        }
      } catch (e) {
        // ignore any unexpected math errors
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // ensure exact alignment at the end
        setRotation(targetRotation);
        setSpinning(false);
        setSelectedIndex(prizeIndex);
        animationRef.current = null;
      }
    }

    prevSegmentRef.current = null;
    animationRef.current = requestAnimationFrame(animate);
  };

  // Play a short tick using the Web Audio API. Called on segment changes.
  function playTick() {
    try {
      const ctx = (audioCtxRef.current ??= new (window.AudioContext || (window as any).webkitAudioContext)());
      if (ctx.state === "suspended") {
        // resume on user gesture (spin click)
        ctx.resume().catch(() => {});
      }

      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.value = 1200; // Hz
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.12, now + 0.001);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

      o.start(now);
      o.stop(now + 0.09);
    } catch (err) {
      // If Audio API unavailable, silently ignore
    }
  }

  const handlePopupClose = () => {
    setResetting(true);
    setShowPopup(false);
    setSelectedIndex(null);
    setRotation(0);
    setTimeout(() => setResetting(false), 50);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center bg-[#f7f6f2] rounded-2xl pt-0 mt-0 px-4 w-full min-h-0">
      <div className="flex-1 flex flex-col items-center">
        <h2 className="text-4xl font-bold mb-6 mt-10">SPIN TO WIN</h2>
        <div className="relative w-[80vw] max-w-[700px] aspect-square flex items-center justify-center">
          {/* Pointer */}
          <div className="absolute left-1/2 -top-8 -translate-x-1/2 z-10 flex flex-col items-center">
            <svg className="w-16 h-24 drop-shadow-lg" viewBox="0 0 40 72">
              <polygon
                points="20,66 34,24 6,24"
                fill="#232b3a"
                stroke="#fff"
                strokeWidth="2"
              />
              <rect x="16" y="0" width="8" height="56" rx="3" fill="#232b3a" />
              <circle
                cx="20"
                cy="24"
                r="5"
                fill="#f76c5e"
                stroke="#fff"
                strokeWidth="2"
              />
            </svg>
          </div>
          {/* Wheel - only render after mount to avoid hydration error */}
          {mounted && (
            <svg
              id="spin-wheel-svg"
              width="100%"
              height="100%"
              viewBox="0 0 320 320"
              style={{
                transition: resetting ? "none" : undefined,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              {prizes.map((prize, i) => {
                const startAngle = (360 / prizes.length) * i;
                const endAngle = startAngle + 360 / prizes.length;
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                const radius = 145;
                const x1 =
                  160 + radius * Math.cos((Math.PI * startAngle) / 180);
                const y1 =
                  160 + radius * Math.sin((Math.PI * startAngle) / 180);
                const x2 = 160 + radius * Math.cos((Math.PI * endAngle) / 180);
                const y2 = 160 + radius * Math.sin((Math.PI * endAngle) / 180);
                const centerAngle = (startAngle + endAngle) / 2;
                const centerRadius = 105;
                const centerX =
                  160 + centerRadius * Math.cos((Math.PI * centerAngle) / 180);
                const centerY =
                  160 + centerRadius * Math.sin((Math.PI * centerAngle) / 180);
                const isWinning = showPopup && selectedIndex === i;
                return (
                  <g key={i}>
                    <path
                      d={`M160,160 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} Z`}
                      fill={prize.color}
                      stroke={isWinning ? "#f76c5e" : "#fff"}
                      strokeWidth={isWinning ? 6 : 3}
                      style={
                        isWinning
                          ? { filter: "drop-shadow(0 0 12px #f76c5e)" }
                          : {}
                      }
                    />
                    <foreignObject
                      x={centerX - 28}
                      y={centerY - 38}
                      width={56}
                      height={76}
                    >
                      <div
                        style={{
                          width: "56px",
                          height: "76px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <Image
                          src={prize.iconUrl}
                          alt={prize.label}
                          width={56}
                          height={56}
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </foreignObject>
                  </g>
                );
              })}
              {/* Center circle - smaller */}
              <circle cx={160} cy={160} r={50} fill="#fff" />
              <foreignObject x={135} y={135} width={50} height={50}>
                <div
                  style={{
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    src="/bspin.svg"
                    alt="Bridgestone Logo"
                    width={40}
                    height={40}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </foreignObject>
            </svg>
          )}
          {/* Clickable button overlay - smaller */}
          <button
            onClick={spin}
            disabled={spinning}
            className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-transparent border-none z-20 ${
              spinning ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            aria-label="Spin the wheel"
          />
        </div>
        {showPopup && selectedIndex !== null && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ background: "rgba(0,0,0,0.6)" }}
          >
            <div
              className="rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center transition-all duration-500 scale-100 opacity-100 popup-zoom"
              style={{ background: "rgba(34,34,34,0.85)", color: "#fff" }}
            >
              <div className="mb-4 text-center">
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  🎉 You won:
                </span>
                <Image
                  src={prizes[selectedIndex].iconUrl}
                  alt={prizes[selectedIndex].label}
                  width={120}
                  height={120}
                  style={{ objectFit: "contain", margin: "0 auto 16px auto" }}
                />
                <span
                  className="text-2xl font-extrabold"
                  style={{
                    color: "#b71c1c",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  {prizes[selectedIndex].label}
                </span>
                <span style={{ fontSize: 22, color: "#b71c1c" }}>🎉</span>
              </div>
              <button
                onClick={handlePopupClose}
                className="mt-2 px-6 py-2 bg-[#f76c5e] text-white rounded-lg font-semibold text-lg shadow hover:bg-[#e05b4d] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

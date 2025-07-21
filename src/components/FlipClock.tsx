import { useState, useEffect } from 'react';

interface FlipClockProps {
  targetDate: string;
  title: string;
}

interface FlipDigitProps {
  digit: number;
  label: string;
}

const FlipDigit = ({ digit, label }: FlipDigitProps) => {
  const [currentDigit, setCurrentDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== currentDigit) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentDigit(digit);
        setIsFlipping(false);
      }, 300);
    }
  }, [digit, currentDigit]);

  const formattedDigit = digit.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-20 md:w-20 md:h-24 lg:w-24 lg:h-28">
        {/* Flip card container */}
        <div className="relative w-full h-full perspective-1000">
          <div
            className={`absolute inset-0 w-full h-full transition-transform duration-300 transform-style-preserve-3d ${
              isFlipping ? 'animate-flip' : ''
            }`}
          >
            {/* Front face */}
            <div className="absolute inset-0 w-full h-full backface-hidden">
              <div className="w-full h-full bg-gray-900 rounded-lg border border-gray-700 flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl md:text-3xl lg:text-4xl font-bold font-mono leading-none">
                  {formattedDigit}
                </span>
              </div>
              {/* Top highlight line */}
              <div className="absolute top-0 left-2 right-2 h-px bg-gray-600"></div>
              {/* Middle separator line */}
              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700 transform -translate-y-px"></div>
              {/* Bottom shadow line */}
              <div className="absolute bottom-0 left-2 right-2 h-px bg-gray-800"></div>
            </div>
          </div>
        </div>
      </div>
      {/* Label */}
      <span className="text-white text-xs md:text-sm font-semibold mt-2 tracking-wider">
        {label}
      </span>
    </div>
  );
};

const FlipClock = ({ targetDate, title }: FlipClockProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black rounded-xl shadow-2xl">
      {/* Title */}
      <h2 className="text-white text-center text-2xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-wide" 
          style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}>
        {title}
      </h2>
      
      {/* Flip clock container */}
      <div className="flex justify-center items-center gap-4 md:gap-6 lg:gap-8">
        <FlipDigit digit={timeLeft.days} label="DAYS" />
        
        {/* Separator colon */}
        <div className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">:</div>
        
        <FlipDigit digit={timeLeft.hours} label="HOURS" />
        
        {/* Separator colon */}
        <div className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">:</div>
        
        <FlipDigit digit={timeLeft.minutes} label="MINUTES" />
        
        {/* Separator colon */}
        <div className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6">:</div>
        
        <FlipDigit digit={timeLeft.seconds} label="SECONDS" />
      </div>
    </div>
  );
};

export default FlipClock;
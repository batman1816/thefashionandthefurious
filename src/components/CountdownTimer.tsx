
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
  onExpire?: () => void;
  className?: string;
  showTitle?: boolean;
  title?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  targetDate, 
  onExpire, 
  className = "",
  showTitle = false,
  title = "Sale Ends In"
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

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
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        if (!isExpired) {
          setIsExpired(true);
          onExpire?.();
        }
      }
    };

    // Calculate immediately
    calculateTimeLeft();

    // Then update every second
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire, isExpired]);

  if (isExpired) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {showTitle && (
        <h3 className="text-lg font-medium text-gray-300 mb-4">{title}</h3>
      )}
      
      {/* Glassmorphism countdown display */}
      <div className="flex items-center justify-center gap-2 md:gap-4 p-4 md:p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/20 shadow-xl">
        {/* Days */}
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/30">
            <div className="text-2xl md:text-4xl font-mono font-bold text-white text-center">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
          </div>
          <span className="text-xs md:text-sm text-gray-300 mt-1 font-medium">DAYS</span>
        </div>

        <div className="text-2xl md:text-4xl text-white/60 font-bold">:</div>

        {/* Hours */}
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/30">
            <div className="text-2xl md:text-4xl font-mono font-bold text-white text-center">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
          </div>
          <span className="text-xs md:text-sm text-gray-300 mt-1 font-medium">HOURS</span>
        </div>

        <div className="text-2xl md:text-4xl text-white/60 font-bold">:</div>

        {/* Minutes */}
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/30">
            <div className="text-2xl md:text-4xl font-mono font-bold text-white text-center">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
          </div>
          <span className="text-xs md:text-sm text-gray-300 mt-1 font-medium">MINS</span>
        </div>

        <div className="text-2xl md:text-4xl text-white/60 font-bold">:</div>

        {/* Seconds */}
        <div className="flex flex-col items-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 md:p-3 min-w-[60px] md:min-w-[80px] border border-white/30">
            <div className="text-2xl md:text-4xl font-mono font-bold text-white text-center">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
          <span className="text-xs md:text-sm text-gray-300 mt-1 font-medium">SECS</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;

import { useState, useEffect } from 'react';

interface FlipClockProps {
  targetDate: string;
  title: string;
}

interface FlipDigitProps {
  digit: string;
  isFlipping: boolean;
  nextDigit: string;
}

const FlipDigit = ({ digit, isFlipping, nextDigit }: FlipDigitProps) => {
  return (
    <div className="relative w-14 h-20 md:w-16 md:h-24 lg:w-20 lg:h-28">
      {/* Panel container */}
      <div className="relative w-full h-full perspective-1000">
        
        {/* Static bottom half - shows current digit */}
        <div className="absolute inset-0 w-full h-full">
          <div className="w-full h-full bg-gradient-to-b from-[#1A1A1A] to-[#111111] rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 rounded-xl shadow-inner-custom"></div>
            
            {/* Bottom half of current digit */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 overflow-hidden rounded-b-xl">
              <div className="w-full h-full flex items-start justify-center pt-0">
                <span 
                  className="text-[#E2E2E2] text-3xl md:text-4xl lg:text-5xl leading-none select-none"
                  style={{ fontFamily: 'Poppins', fontWeight: '400', transform: 'translateY(-50%)' }}
                >
                  {isFlipping ? nextDigit : digit}
                </span>
              </div>
            </div>
            
            {/* Center hinge line */}
            <div className="absolute top-1/2 left-0 right-0 h-px bg-[#333333] transform -translate-y-px z-10"></div>
          </div>
        </div>

        {/* Flipping top half */}
        <div className={`absolute top-0 left-0 right-0 h-1/2 transform-style-preserve-3d origin-bottom transition-transform duration-300 ${
          isFlipping ? 'animate-flip-top' : ''
        }`}>
          <div className="w-full h-full bg-gradient-to-b from-[#1A1A1A] to-[#111111] rounded-t-xl shadow-lg relative overflow-hidden backface-hidden">
            <div className="absolute inset-0 rounded-t-xl shadow-inner-custom"></div>
            
            {/* Top half of current digit */}
            <div className="w-full h-full overflow-hidden rounded-t-xl">
              <div className="w-full h-full flex items-end justify-center pb-0">
                <span 
                  className="text-[#E2E2E2] text-3xl md:text-4xl lg:text-5xl leading-none select-none"
                  style={{ fontFamily: 'Poppins', fontWeight: '400', transform: 'translateY(50%)' }}
                >
                  {digit}
                </span>
              </div>
            </div>
            
            {/* Top half overlay for depth */}
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[#1A1A1A] to-transparent opacity-20 rounded-t-xl"></div>
          </div>
        </div>

        {/* Incoming bottom half - shows next digit during flip */}
        <div className={`absolute bottom-0 left-0 right-0 h-1/2 transform-style-preserve-3d origin-top transition-transform duration-300 ${
          isFlipping ? 'animate-flip-bottom' : 'rotate-x-90'
        }`}>
          <div className="w-full h-full bg-gradient-to-b from-[#1A1A1A] to-[#111111] rounded-b-xl shadow-lg relative overflow-hidden backface-hidden">
            <div className="absolute inset-0 rounded-b-xl shadow-inner-custom"></div>
            
            {/* Bottom half of next digit */}
            <div className="w-full h-full overflow-hidden rounded-b-xl">
              <div className="w-full h-full flex items-start justify-center pt-0">
                <span 
                  className="text-[#E2E2E2] text-3xl md:text-4xl lg:text-5xl leading-none select-none"
                  style={{ fontFamily: 'Poppins', fontWeight: '400', transform: 'translateY(-50%)' }}
                >
                  {nextDigit}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlipClock = ({ targetDate, title }: FlipClockProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [prevTimeLeft, setPrevTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [isFlipping, setIsFlipping] = useState({
    hours1: false,
    hours2: false,
    minutes1: false,
    minutes2: false,
    seconds1: false,
    seconds2: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const newTimeLeft = { hours, minutes, seconds };
        
        // Check which digits changed and trigger flip animations
        const hours1 = Math.floor(hours / 10);
        const hours2 = hours % 10;
        const minutes1 = Math.floor(minutes / 10);
        const minutes2 = minutes % 10;
        const seconds1 = Math.floor(seconds / 10);
        const seconds2 = seconds % 10;
        
        const prevHours1 = Math.floor(prevTimeLeft.hours / 10);
        const prevHours2 = prevTimeLeft.hours % 10;
        const prevMinutes1 = Math.floor(prevTimeLeft.minutes / 10);
        const prevMinutes2 = prevTimeLeft.minutes % 10;
        const prevSeconds1 = Math.floor(prevTimeLeft.seconds / 10);
        const prevSeconds2 = prevTimeLeft.seconds % 10;

        const newFlipState = {
          hours1: hours1 !== prevHours1,
          hours2: hours2 !== prevHours2,
          minutes1: minutes1 !== prevMinutes1,
          minutes2: minutes2 !== prevMinutes2,
          seconds1: seconds1 !== prevSeconds1,
          seconds2: seconds2 !== prevSeconds2,
        };

        setIsFlipping(newFlipState);
        setPrevTimeLeft(timeLeft);
        setTimeLeft(newTimeLeft);

        // Reset flip animations after 300ms
        setTimeout(() => {
          setIsFlipping({
            hours1: false,
            hours2: false,
            minutes1: false,
            minutes2: false,
            seconds1: false,
            seconds2: false,
          });
        }, 300);
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, timeLeft, prevTimeLeft]);

  // Format digits for display
  const hours1 = Math.floor(timeLeft.hours / 10).toString();
  const hours2 = (timeLeft.hours % 10).toString();
  const minutes1 = Math.floor(timeLeft.minutes / 10).toString();
  const minutes2 = (timeLeft.minutes % 10).toString();
  const seconds1 = Math.floor(timeLeft.seconds / 10).toString();
  const seconds2 = (timeLeft.seconds % 10).toString();

  // Format next digits for flip animation
  const nextHours1 = Math.floor(prevTimeLeft.hours / 10).toString();
  const nextHours2 = (prevTimeLeft.hours % 10).toString();
  const nextMinutes1 = Math.floor(prevTimeLeft.minutes / 10).toString();
  const nextMinutes2 = (prevTimeLeft.minutes % 10).toString();
  const nextSeconds1 = Math.floor(prevTimeLeft.seconds / 10).toString();
  const nextSeconds2 = (prevTimeLeft.seconds % 10).toString();

  // Check if countdown is finished
  const isFinished = timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  if (isFinished) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 bg-black rounded-xl shadow-2xl">
        <h2 className="text-white text-center text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide" 
            style={{ fontFamily: 'Poppins', fontWeight: '700' }}>
          Sale Ended
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-black rounded-xl shadow-2xl">
      {/* Title */}
      <h2 className="text-white text-center text-2xl md:text-4xl lg:text-5xl font-bold mb-8 tracking-wide" 
          style={{ fontFamily: 'Poppins', fontWeight: '700' }}>
        {title}
      </h2>
      
      {/* Flip clock container - HH:MM:SS format */}
      <div className="flex justify-center items-center gap-2 md:gap-3 lg:gap-4">
        {/* Hours */}
        <FlipDigit digit={hours1} isFlipping={isFlipping.hours1} nextDigit={nextHours1} />
        <FlipDigit digit={hours2} isFlipping={isFlipping.hours2} nextDigit={nextHours2} />
        
        {/* Colon separator */}
        <div className="text-[#E2E2E2] text-2xl md:text-3xl lg:text-4xl mx-1" 
             style={{ fontFamily: 'Poppins', fontWeight: '400' }}>:</div>
        
        {/* Minutes */}
        <FlipDigit digit={minutes1} isFlipping={isFlipping.minutes1} nextDigit={nextMinutes1} />
        <FlipDigit digit={minutes2} isFlipping={isFlipping.minutes2} nextDigit={nextMinutes2} />
        
        {/* Colon separator */}
        <div className="text-[#E2E2E2] text-2xl md:text-3xl lg:text-4xl mx-1" 
             style={{ fontFamily: 'Poppins', fontWeight: '400' }}>:</div>
        
        {/* Seconds */}
        <FlipDigit digit={seconds1} isFlipping={isFlipping.seconds1} nextDigit={nextSeconds1} />
        <FlipDigit digit={seconds2} isFlipping={isFlipping.seconds2} nextDigit={nextSeconds2} />
      </div>
    </div>
  );
};

export default FlipClock;
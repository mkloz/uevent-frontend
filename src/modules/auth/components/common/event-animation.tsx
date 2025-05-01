import { type FC, useEffect, useState } from 'react';
import {
  FaBasketballBall,
  FaBook,
  FaCalendarAlt,
  FaCameraRetro,
  FaFilm,
  FaLaptopCode,
  FaMusic,
  FaRunning,
  FaTheaterMasks,
  FaUtensils
} from 'react-icons/fa';

import { Logo } from '../../../../assets/logos/logo';

export const EventAnimation: FC = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimate((prev) => !prev);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const eventIcons = [
    { Icon: FaCalendarAlt, position: { top: '10%', left: '20%' }, inside: true },
    { Icon: FaMusic, position: { top: '30%', right: '15%' }, inside: false },
    { Icon: FaFilm, position: { top: '70%', left: '25%' }, inside: true },
    { Icon: FaTheaterMasks, position: { bottom: '20%', right: '10%' }, inside: false },
    { Icon: FaRunning, position: { bottom: '75%', left: '45%' }, inside: true },
    { Icon: FaUtensils, position: { top: '50%', right: '20%' }, inside: false },
    { Icon: FaBasketballBall, position: { top: '5%', right: '25%' }, inside: false },
    { Icon: FaLaptopCode, position: { bottom: '10%', left: '15%' }, inside: true },
    { Icon: FaBook, position: { bottom: '10%', right: '45%' }, inside: false },
    { Icon: FaCameraRetro, position: { top: '40%', left: '10%' }, inside: true }
  ];

  return (
    <div className="relative flex items-center justify-center h-full  overflow-hidden w-full">
      {/* Background Pulses */}
      <div
        className={`absolute w-48 h-48 bg-indigo-500 rounded-full opacity-30 transition-all duration-1000 scale-100 ${animate ? 'scale-150 opacity-0' : 'scale-100 opacity-30'}`}
      />
      <div
        className={`absolute w-72 h-72 bg-indigo-500 rounded-full opacity-20 transition-all duration-1000 delay-200 ${animate ? 'scale-180 opacity-0' : 'scale-100 opacity-20'}`}
      />

      {/* Floating Event Icons */}
      {eventIcons.map(({ Icon, position }, i) => (
        <Icon
          key={i}
          className={`absolute text-indigo-400 text-2xl transition-all duration-1000 ${animate ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}
          style={position}
        />
      ))}

      {/* Main Logo */}
      <div className={`transition-all duration-1000 ${animate ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}`}>
        <Logo className="drop-shadow-xl size-32" />
      </div>
    </div>
  );
};

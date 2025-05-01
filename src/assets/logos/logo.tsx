import type { FC } from 'react';

type LogoProps = {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
};

export const Logo: FC<LogoProps> = ({ width = '1rem', height = '1rem', fill = '#4F46E5', className = '' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}>
    <path
      d="M30 8C19.5066 8 11 16.5066 11 27C11 32.5599 13.3018 37.5783 17 41.0888V41.0888L30 54L43 41.0888C46.6982 37.5783 49 32.5599 49 27C49 16.5066 40.4934 8 30 8Z"
      className=""
      fill={fill}
    />

    {/* Inner Circle */}
    <circle cx="30" cy="27" r="10" className="fill-background " />

    {/* Event Elements */}
    <rect x="25" y="22" width="10" height="2" rx="1" fill={fill} />
    <rect x="25" y="26" width="10" height="2" rx="1" fill={fill} />
    <rect x="25" y="30" width="6" height="2" rx="1" fill={fill} />
  </svg>
);

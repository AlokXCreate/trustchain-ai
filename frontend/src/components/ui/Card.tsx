import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-navy-850 border border-slate-200/80 dark:border-navy-700/80 rounded-xl p-5 shadow-subtle ${
        hover
          ? 'transition-all duration-200 hover:shadow-card-hover hover:border-brand-accent/40 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

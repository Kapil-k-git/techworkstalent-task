import React from 'react';

interface PrimaryButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  type = 'button',
  onClick,
  children,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`mt-2 w-full h-[54px] text-white text-base font-bold xs:p-4 py-4 rounded-lg cursor-pointer ${className}`}
    >
      <div className="flex justify-center">
        {children}
      </div>
    </button>
  );
};

export default PrimaryButton;

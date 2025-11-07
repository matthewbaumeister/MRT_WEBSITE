import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const Card = ({ children, className = "", hover = false }: CardProps) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-lg overflow-hidden ${
        hover ? "transition-transform duration-300 hover:scale-105 hover:shadow-xl" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;


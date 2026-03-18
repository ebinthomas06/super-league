import Lottie from 'lottie-react';
import footballAnimation from '../assets/football-loader.json';

export function Loader({ className = "w-24 h-24" }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <Lottie animationData={footballAnimation} loop={true} />
    </div>
  );
}

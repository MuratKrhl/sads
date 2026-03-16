import React from 'react';

const AiAssistCard: React.FC = () => {
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-600 text-white relative overflow-hidden">
      <div className="relative z-10 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold">How AI assist will</h3>
          <h3 className="text-xl font-bold mb-3">help you?</h3>
          <button className="bg-white text-teal-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-gray-100 transition-colors">
            Start AI
          </button>
        </div>
        <div>
            <img 
                src="https://cdn-icons-png.flaticon.com/512/10469/10469273.png" 
                alt="AI Robot" 
                className="w-24 h-24 object-contain"
            />
        </div>
      </div>
    </div>
  );
};

export default AiAssistCard;

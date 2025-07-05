import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

function SelectAvatar() {
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const navigate = useNavigate();

  const superheroAvatars = useMemo(() => 
    Array.from({ length: 19 }, (_, i) => `avatar${i + 1}.png`),
    []
  ); 
  
  const handleAvatarSelect = useCallback((avatar) => {
    setSelectedAvatar(avatar);
  }, [navigate]);

  const continueWithSelectedAvatar = async () => {
    console.log(selectedAvatar);
    
    try {
      const res = await fetch("http://localhost:5000/avatar", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({ Avatar: selectedAvatar }),
      });
  
      console.log(res);
      
      if (res.ok) {
        alert("Avatar Selected Successfully!");
        navigate('/profile');
      } else {
        const data = await res.text();
        console.error("Server Error:", data);
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while updating avatar.");
    }
  };
  
  return (
    <div className="flex flex-col justify-center items-center bg-slate-950 min-h-screen p-8">
      <div className="w-full max-w-4xl bg-slate-900 border border-lime-200 rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center text-gray-100 mb-12 p-2">Choose Your Avatar</h2>
        
        <div className="grid md:grid-cols-5 sm:grid-cols-4 gap-4 mb-10">
          {superheroAvatars.map((avatar) => (
            <div key={avatar} className="flex justify-center">
              <div 
                className={`relative cursor-pointer transition-all duration-200 transform hover:scale-110 ${
                  selectedAvatar === avatar 
                    ? "ring ring-white scale-105" 
                    : "hover:ring hover:ring-white"
                }`}
              >
                <img
                  src={`/avatars/${avatar}`}
                  alt={`Avatar option ${avatar.replace('.png', '')}`}
                  onClick={() => handleAvatarSelect(avatar)}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full"
                  loading="lazy"
                />
                {selectedAvatar === avatar && (
                  <div className="absolute -top-2 -right-2 bg-rose-400 rounded-full w-6 h-6 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {selectedAvatar && (
          <div className="mt-8 flex justify-center">
            <button 
              onClick={continueWithSelectedAvatar}
              className="px-6 py-2 bg-rose-400 text-white rounded-lg hover:bg-rose-500 transition-colors font-medium"
            >
              Continue with Selected Avatar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectAvatar;

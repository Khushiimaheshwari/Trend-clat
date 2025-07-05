import React, { useEffect, useState } from 'react'
import { Boxes } from './components/ui/background-boxes'
import { ColourfulText } from './components/ui/colourful-text'
import { useNavigate } from 'react-router-dom'
import Loader from './components/Loader'

function Landing_Page() {

    const [loading, setLoading] = useState(true)
    const [isNavigating, setIsNavigating] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        const timer = setTimeout(() => {
          setLoading(false);
        }, 1000); 
    
        return () => clearTimeout(timer); 
      }, []);

    const handleNavigate = () => {
        setIsNavigating(true); 
        setTimeout(() => {
          navigate('/login');
        }, 800); 
      };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-slate-950">
            {(loading || isNavigating) ? (
                <div className="flex justify-center">
                    <Loader />
                </div>
            ) : ( 
            <>
                <div className="absolute inset-0 h-full w-full">
                <Boxes/>
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center top-50 px-4 text-center gap-5">
                    <img src="logo.png" alt="Logo" width={"10%"} />
                    <h1 className='xl:text-8xl lg:text-7xl md:text-6xl font-bold'>Welcome to <ColourfulText text="TrendÉclat!" /></h1>
                    <p className="xl:text-2xl lg:text-xl md:text-lg text-lime-100 max-w-2xl mx-auto py-5 drop-shadow">
                    Fashion isn’t just what you wear — it’s how you shine. Let TrendÉclat be your signature of brilliance.
                    </p>

                    <button 
                    onClick={handleNavigate}
                    className="px-6 py-3 bg-lime-100 hover:scale-110 cursor-pointer text-black rounded-lg font-semibold hover:bg-lime-200 transition duration-300">
                        Shine in Style
                    </button>
                </div>
            </>
            )}
        </div>
    )
}

export default Landing_Page

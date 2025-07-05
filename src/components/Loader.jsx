import React from "react";  
import { DNA } from 'react-loader-spinner'

const Loader = () => {
    return (
      <div className="flex justify-center items-center min-h-screen w-full bg-slate-950">
      {/* <div className="flex justify-center items-center h-full w-full translate-y-[200%] bg-slate-950"> */}
        <DNA visible={true} height={140} width={140} ariaLabel="dna-loading" />
      </div>
    ); 
  };
 
export default Loader;


"use client";
import React,{useEffect,useState} from "react";
import { BackgroundBeams } from "@/app/components/ui/background-beams";
import axios from 'axios'

export function BackgroundBeamsDemo() {
const [mentors, setmentors] = useState([])
const handleAll=async()=>{
    console.log("start");
    
    const resp=await axios.get("http://localhost:5000/allMentor")
    setmentors(resp.data)
    console.log(resp.data);
    

}
useEffect(() => {
    handleAll()
},[])

  return (
    <div className="h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Mentor List
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10">

{
    mentors.map((mentor)=>{
        return (<div className="text-white">
      <h1>mentor : {mentor}</h1>
        </div>
        )
    }
)

}

        </p>
        <input
          type="text"
          placeholder="hi@manuarora.in"
          className="rounded-lg border border-neutral-800 focus:ring-2 focus:ring-teal-500  w-full relative z-10 mt-4  bg-neutral-950 placeholder:text-neutral-700"
        />
      </div>
      {/* <BackgroundBeams /> */}
    </div>
  );
}

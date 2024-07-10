"use client"
import React,{useState,useEffect} from 'react'

function page() {

const [allData,setData]=useState("");


    var a="javascript"
const handleSubmit=()=>{
    a="hi";
    console.log(`value is ${a}`)
}

useEffect(()=>{
console.log("hello");
})
  return (
    <div> ljbbbihp {a}
    
    <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}

export default page
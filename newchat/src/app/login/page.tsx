"use client"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import "bootstrap/dist/css/bootstrap.min.css"
import React,{useState,useEffect} from 'react'
import { SignupFormDemo } from '@/app/components/SignupFormDemo';
import {motion} from 'framer-motion'

function Page(){
       

// LOGIN PAGE

return (
  <div className='w-screen dark bg-black'>

<motion.div

initial={{y:-100}}
animate={{y:0}}
transition={{duration:1.5}}
className='h-full w-screen dark  pt-5'
>

<SignupFormDemo />

    </motion.div>
   </div>
);

      
      
      
      
      

}

export default Page


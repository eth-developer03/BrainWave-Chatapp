'use client';
import React, { ChangeEvent, ReactEventHandler, useState } from 'react';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { cn } from '@/utils/cn';
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from '@tabler/icons-react';
import e from 'cors';
import axios from "axios"
import { useRouter } from 'next/navigation';
import { useSocket } from '../provider/SocketProvider';


export function SignupFormDemo() {
  const socket=useSocket()
  const router=useRouter()
  const [role, setRole] = useState('');
  const [user, setUser] = useState({
    Name: '',
    Email: '',
    Password: '',
    Age: '',
    Role: '',
  });
// Changing Roles
  // const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   setRole(e.target.value);
  //   setUser((prev) => ({ ...prev, Role: e.target.value }));
  // };
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setUser((prev) => ({ ...prev, Role: value }));
  };

  // Updating The User

  const UpdateUser = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };


  // Final Submission
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("user is ",user);
      
      const sendResponse = await axios.post("http://localhost:5000/submit", user,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(sendResponse.data);
      router.push("/newPage")
      

      console.log(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data || error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  };


  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-extrabold text-3xl text-neutral-800 dark:text-neutral-900">
        Welcome to BrainWave Junction
      </h2>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">Name</Label>
            <Input
              id="firstname"
              placeholder="Rahul Gupta"
              type="text"
              onChange={UpdateUser}
              name="Name"
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="rahul23@gmail.com"
            type="email"
            onChange={UpdateUser}
            name="Email"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••"
            type="password"
            onChange={UpdateUser}
            name="Password"
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="age">AGE</Label>
          <Input
            id="age"
            placeholder="21"
            type="number"
            onChange={UpdateUser}
            name="Age"
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-3 border-black">
          <select
            id="exampleDropdown"
            // value={selectedValue}
            value={user.Role}
            onChange={handleChange}
          >
            <option value="" disabled>
              Select Your Role
            </option>
            <option value="Student">Student</option>
            <option value="Mentor">Mentor</option>
          </select>
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          //   type="submit"
          onClick={handleSubmit}
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  );
};

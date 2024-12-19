"use client";

import React, { use, useRef } from "react";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";
import { useRouter } from "next/navigation";
import useUserStore from "../store/user";

const Login = () => {
  const router = useRouter();
  const name = useRef("");
  const handleLogin = () => {
    router.push("/create-vote");
    useUserStore.getState().setName(name.current);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    name.current = e.target.value;
  };

  return (
    <div className="text-black flex items-center justify-center bg-gradient-to-b from-[#a1d3ee] from-0% via-[#a1d5ed] via-20% to-[#e7f4fe] to-71% w-full h-screen">
      <div className="form w-[350px] h-[400px] rounded-2xl bg-gradient-to-b from-[#adebfae0] from-0% via-[#fcfcfc] via-40% to-[#ffffff] to-71% shadow-lg p-6 flex flex-col">
        <h1 className="text-3xl font-extrabold text-center mb-4 text-[#333]">
          Welcome to the <br />
          <span className="text-[#0070f3]">Vote for Fun</span>
        </h1>
        <p className="text-center text-sm text-[#666] mb-6">
          Please enter your name to continue
        </p>
        <div className="flex-grow flex items-center justify-center flex-col gap-5">
          <Input
            className="bg-[#ebedf0a2] border-none h-[50px] text-base"
            placeholder="What the fuck is your name?"
            onChange={handleNameChange}
          />
          <Button
            className="w-full rounded-xl text-lg h-[40px] bg-black"
            onClick={handleLogin}
          >
            Let's go
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;

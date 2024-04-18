"use client";

import { login, startSandbox } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const Home = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.email.value) {
      return toast.error("Email is required");
    }
    const user = await login(e.currentTarget.email.value as string);

    if (!user) {
      return toast.error("Login failed");
    }

    router.push("/code");
    toast.success("Login success");
    const sandbox = await startSandbox(user.email);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <form className="w-[300px] space-y-2" onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <Input required id="email" type="email" placeholder="you@example.com" />
        <Button className="w-full" type="submit">
          Start Coding
        </Button>
      </form>
    </div>
  );
};

export default Home;

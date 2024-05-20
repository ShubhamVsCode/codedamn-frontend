"use client";

import React from "react";
import { login, startSandbox } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useSandboxStore } from "@/store/sandbox";
import { useUserStore } from "@/store/user";

const Home = () => {
  const router = useRouter();
  const { setSandboxUrl } = useSandboxStore();
  const { setUserId } = useUserStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.email.value) {
      return toast.error("Email is required");
    }
    const user = await login(e.currentTarget.email.value as string);

    if (!user) {
      return toast.error("Login failed");
    }

    toast.success("Login success");
    localStorage.setItem("userId", user._id);
    setUserId(user._id);

    const sandbox = await startSandbox(user.email);
    if (sandbox?.url) {
      setSandboxUrl(sandbox.url);
      localStorage.setItem("sandboxUrl", sandbox.url);
    }

    toast.success("Sandbox started");
    router.push("/code");
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

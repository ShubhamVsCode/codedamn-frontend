"use client";
import React from "react";
import { useTabsStore } from "@/store/tabs";
import { Cross1Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

const Tabs = () => {
  const { tabs, activeTab, addTab, removeTab, setActiveTab } = useTabsStore();

  return (
    <div className="h-12 bg-black flex">
      {tabs.map((tab) => (
        <div
          className={cn(
            "w-fit bg-slate-900 border-r px-3 flex items-center justify-center gap-2 cursor-pointer",
            activeTab === tab.path && "bg-slate-800",
          )}
          key={tab.path}
          onClick={() => {
            setActiveTab(tab.path);
          }}
        >
          <span>{tab.name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeTab(tab.path);
            }}
          >
            <Cross1Icon className="size-3" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Tabs;
